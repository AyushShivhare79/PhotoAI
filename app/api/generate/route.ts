import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

async function generateImage(req: NextRequest) {
  const client = new OpenAI({
    baseURL: process.env.FLUX_API_URL,
    apiKey: process.env.FLUX_API_KEY,
  });

  const { prompt } = await req.json();

  const response = await client.images.generate({
    model: process.env.FLUX_MODEL,
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    response_format: "url",
  });
  const imageUrl = response.data[0].url;

  return NextResponse.json({ imageUrl }, { status: 201 });
}

export { generateImage as GET, generateImage as POST };
