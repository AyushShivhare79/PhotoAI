import OpenAI from "openai";

import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/prisma";

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

    const { prompt, fileName = "photo-ai" } = await req.json();

    const generateImage = await client.images.generate({
      model: process.env.FLUX_MODEL,
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = generateImage.data[0].url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL not found" },
        { status: 500 }
      );
    }

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName,
      useUniqueFileName: true,
      folder: "/photo-ai",
    });

    const userId = session?.user?.id;

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

    return NextResponse.json({ success: true, image: storeImage });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

export { generateImage as POST };
