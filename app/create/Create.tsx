"use client";

import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { poppins } from "@/lib/font";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { FormSchema } from "../types/schema";

interface ImageProp {
  id: string;
  url: string;
}

export default function Create() {
  const [image, setImage] = useState<ImageProp[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const session = useSession();
  const router = useRouter();

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get("/api/getImages");
      setImage(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const play = () => {
    const audio = new Audio("/audio/generate.mp3");
    audio.play();
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      const response = await axios.post("/api/generate", {
        prompt: data.prompt,
      });

      if (response.data.success) {
        const newImage = {
          id: response.data.image.id,
          url: response.data.image.url,
        };
        setImage((prev) => [newImage, ...prev]);
        form.reset();
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while generating the image.");
    } finally {
      setLoading(false);
      play();
    }
  }

  const formRender = () => {
    return (
      <div className="flex justify-center items-end gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex gap-2 justify-center items-end">
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        className={`resize-none rounded-none ${poppins.className}`}
                        placeholder="Describe what you want to see!"
                        {...field}
                      />
                    </FormControl>
                    <div className="pb-2">
                      <button
                        disabled={loading}
                        type="submit"
                        className={`bg-[#c0c0c0] text-xl border border-white text-black hover:font-semibold cursor-pointer h-10 w-40`}
                      >
                        {loading ? "Generating..." : "Generate"}
                      </button>
                    </div>
                  </div>
                  <FormDescription>
                    Be detailed and specific about the subject, style, lighting,
                    and composition for better results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  };

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

  return (
    <>
      <div className="px-60 p-4 space-y-10 overflow-hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl">AI IMAGE CREATION</h1>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-12 h-12 cursor-pointer">
                <AvatarImage src={`${session.data?.user?.image}`} />
                <AvatarFallback className="text-black">
                  {session.data?.user?.name
                    ?.split(" ")[0]
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
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

        <div className="space-y-4">
          <div>{formRender()}</div>

          <div>
            <h1 className="text-3xl">Images</h1>
            {fetchLoading ? (
              <div className="grid grid-cols-3 w-[85%] gap-5 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[380px] w-[380px] rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div>
                {image.length ? (
                  <div className="grid grid-cols-3 w-[90%] gap-5 p-4">
                    {image.map((img) => (
                      <Image
                        key={img.id}
                        src={img.url}
                        width={500}
                        height={500}
                        className="rounded-xl"
                        alt="Image"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-xl">No images generated</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
