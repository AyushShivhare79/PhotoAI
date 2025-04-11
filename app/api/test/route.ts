import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, fileName = "generated-image" } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    // Download image from the provided URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName,
      folder: "/photo-ai", // optional
    });

    return NextResponse.json({ success: true, url: uploadResponse.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
