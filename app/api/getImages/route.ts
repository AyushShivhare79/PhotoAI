import authOptions from "@/lib/auth";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function getImages(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;

  const response = await prisma.generatedImage.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(response);
}

export { getImages as GET };
