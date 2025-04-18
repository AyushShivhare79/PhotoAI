'use server';

import { getServerSession } from 'next-auth';
import prisma from '@/prisma';
import authOptions from '@/lib/auth';

export async function getImages() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return null;
  }

  try {
    const response = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        generatedImage: {
          select: {
            id: true,
            url: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        credits: true,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}
