"use client";

import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import Top from "./Top";
import { promptSchema } from "../types/schema";

interface ImageProp {
  id: string;
  url: string;
}

const play = () => {
  const audio = new Audio("/audio/generate.mp3");
  audio.volume = 0.1;

  audio.play();
};

export default function Create() {
  const [image, setImage] = useState<ImageProp[]>([]);
  const [credits, setCredits] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/getImages");
      setImage(response.data.generatedImage);
      setCredits(response.data.credits);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setFetchLoading(false);
    }
  }, [image, credits]);

  useEffect(() => {
    fetchData();
  }, [image]);

  const form = useForm<z.infer<typeof promptSchema>>({
    defaultValues: {
      prompt: "",
    },
    resolver: zodResolver(promptSchema),
  });

  async function onSubmit(data: z.infer<typeof promptSchema>) {
    try {
      setGenerateLoading(true);
      const response = await axios.post("/api/generate", {
        prompt: data.prompt,
      });

      if (response.data.success) {
        const newImage = {
          id: response.data.image.id,
          url: response.data.image.url,
        };
        setImage((prev) => [newImage, ...prev]);
        play();
        form.reset();
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while generating the image.");
    } finally {
      setGenerateLoading(false);
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
                  <div className="flex flex-col lg:flex-row gap-2 justify-center items-end">
                    <FormControl>
                      <Textarea
                        disabled={generateLoading}
                        className={`resize-none rounded-none ${poppins.className}`}
                        placeholder="Describe what you want to see!"
                        {...field}
                      />
                    </FormControl>

                    <div className="pb-2 space-y-2 w-full lg:w-auto">
                      <button
                        disabled={generateLoading}
                        type="submit"
                        className={`bg-[#c0c0c0] text-xl border border-white text-black hover:font-semibold cursor-pointer w-full h-10 lg:w-40`}
                      >
                        {generateLoading ? "Generating..." : "Generate"}
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
      <div className="lg:px-60 p-4 space-y-10 overflow-hidden">
        <Top credits={credits} />

        <div className="space-y-4">
          <div>{formRender()}</div>

          <section>
            <h1 className="text-3xl">Images</h1>
            <div className="flex justify-center lg:justify-start items-center">
              {fetchLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 w-[85%] gap-5 p-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-[220px] h-[220px] lg:h-[380px] lg:w-[380px] rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center lg:justify-start items-center">
                  {image.length ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 w-[85%] gap-5 p-4">
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
                    <div className="text-center text-xl">
                      No images generated
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
