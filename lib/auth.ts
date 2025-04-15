import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/index";
import { AuthOptions } from "next-auth";
import { Session } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }: { session: Session }) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email!,
        },
      });

      if (user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
} as AuthOptions;

export default authOptions;
