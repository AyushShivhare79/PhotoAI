import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/index";
import { AuthOptions } from "next-auth";

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
    async session({ session, token }) {
      // const user = await prisma.user.findUnique({
      //   where: {
      //     email: session.user.email!,
      //   },
      // });
      if (token) {
        session.user.id = token.sub!;
      }

      return session;
    },
  },
} as AuthOptions;

export default authOptions;
