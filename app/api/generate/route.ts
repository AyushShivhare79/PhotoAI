import OpenAI from 'openai';

import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import prisma from '@/prisma';
import { promptSchema } from '@/app/types/schema';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

async function generateImage(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const client = new OpenAI({
      baseURL: process.env.FLUX_API_URL,
      apiKey: process.env.FLUX_API_KEY,
    });

    const { prompt, fileName = 'photo-ai' } = await req.json();

    const { success } = promptSchema.safeParse({ prompt });

    if (!success) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credits: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user?.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 403 },
      );
    }

    const generateImage = await client.images.generate({
      model: process.env.FLUX_MODEL,
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageUrl = generateImage.data[0].url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL not found' },
        { status: 500 },
      );
    }

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName,
      useUniqueFileName: true,
      folder: process.env.IMAGEKIT_FOLDER,
    });

    await prisma.$transaction(async (prisma) => {
      const storeImage = await prisma.generatedImage.create({
        data: {
          userId,
          url: uploadResponse.url,
        },
        select: {
          id: true,
          url: true,
        },
      });

      if (!storeImage) {
        return NextResponse.json(
          { error: 'Failed to store image' },
          { status: 500 },
        );
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    );
  }
}

export { generateImage as POST };
