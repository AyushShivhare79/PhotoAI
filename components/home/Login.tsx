"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <div className="h-screen flex justify-center items-center">
      <Button
        onClick={() => {
          session.status === "authenticated"
            ? signOut()
            : signIn("google", { callbackUrl: "/" });
        }}
      >
        {session.status === "authenticated" ? <p>Signout</p> : <p>Signin</p>}
      </Button>
    </div>
  );
}
