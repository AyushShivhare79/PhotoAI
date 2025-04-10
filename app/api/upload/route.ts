import authOptions from "@/lib/auth";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function uploadImage(req: NextRequest) {
  const { imageUrl } = await req.json();
  const session = await getServerSession(authOptions);

  const userId = session.user.id;

  const response = await prisma.generatedImage.create({
    data: {
      userId,
      url: imageUrl,
    },
  });

  return NextResponse.json({
    message: "Image uploaded successfully",
    image: response,
  });
}

export { uploadImage as GET, uploadImage as POST };
