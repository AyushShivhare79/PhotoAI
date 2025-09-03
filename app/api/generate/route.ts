import OpenAI from 'openai';

import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import prisma from '@/prisma';
import { promptSchema } from '@/app/types/schema';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

type ImageResponse = {
  role: string;
  content: string | any[];
  images?: {
    type: 'image_url';
    image_url: { url: string };
    index: number;
  }[];
};

async function generateImage(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const client = new OpenAI({
      baseURL: process.env.IMAGE_GEN_API_BASE_URL,
      apiKey: process.env.IMAGE_GEN_API_KEY,
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

    const generateImage = await client.chat.completions.create({
      model: process.env.IMAGE_GEN_MODEL!,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    console.log('Generate Image: ', generateImage.choices[0].message);

    const message = generateImage.choices[0].message as ImageResponse;

    if (!message.images) {
      return NextResponse.json(
        { error: 'Image generation failed' },
        { status: 500 },
      );
    }

    const imageUrl = message.images[0]?.image_url.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL not found' },
        { status: 500 },
      );
    }

    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

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
