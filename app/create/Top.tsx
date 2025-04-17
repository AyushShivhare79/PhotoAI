"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { poppins } from "@/lib/font";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Top({ credits }: { credits: number }) {
  const session = useSession();
  const router = useRouter();

  const dropDownOptions = [
    {
      label: "Profile",
      onClick: () => {
        router.push("/");
      },
    },
    {
      label: "Logout",
      onClick: () => {
        signOut({ redirect: true, callbackUrl: "/" });
      },
    },
  ];
  const fallback = session.data?.user?.name
    ?.split(" ")[0]
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl lg:text-5xl">AI IMAGE CREATION</h1>
      <div className="flex items-center gap-4">
        <span className="flex gap-1 text-base lg:text-xl">
          Credits:
          <span className={`${poppins.className}`}>{credits}</span>
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className=" w-10 h-10 lg:w-12 lg:h-12 cursor-pointer">
              <AvatarImage src={`${session.data?.user?.image}`} />
              <AvatarFallback className="text-black">{fallback}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {dropDownOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onClick={option.onClick}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
