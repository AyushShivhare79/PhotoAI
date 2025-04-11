"use client";

import { Textarea } from "@/components/ui/textarea";
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
import { ImageProp } from "./Right";

const FormSchema = z.object({
  prompt: z
    .string({ message: "Prompt is required." })
    .min(10, {
      message: "Prompt must be at least 10 characters.",
    })
    .max(500, {
      message: "Prompt must not be longer than 500 characters.",
    }),
});

export default function Create() {
  const [image, setImage] = useState<ImageProp[]>([]);

  const fetchImages = useCallback(async () => {
    const response = await axios.get("/api/getImages");
    setImage(response.data);
  }, [image]);

  useEffect(() => {
    fetchImages();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
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
                        className={`resize-none rounded-none ${poppins.className}`}
                        placeholder="Describe what you want to see!"
                        {...field}
                      />
                    </FormControl>
                    <div className="pb-2">
                      <button
                        type="submit"
                        className={`bg-[#c0c0c0] text-xl border border-white text-black hover:font-semibold cursor-pointer h-10 w-40`}
                      >
                        Generate
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

  return (
    <>
      <div className="flex min-h-screen w-full overflow-hidden">
        {/* Left */}
        <div className="min-w-[25%] max-w-[25%] border border-white"></div>

        {/* Right */}
        <div className="min-w-[75%] max-w-[75%] w-full p-4 space-y-5">
          <h1 className="text-5xl">AI IMAGE CREATION</h1>
          <div>{formRender()}</div>

          <h1 className="text-2xl">Images</h1>
          <div className="grid grid-cols-3 w-[85%] gap-5 p-4">
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
        </div>
      </div>
    </>
  );
}
