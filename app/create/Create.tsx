"use client";

import Button from "@/components/Button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Right from "./Right";
import { poppins } from "@/lib/font";

export default function Create() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleClick = useCallback(async () => {
    const response = await axios.post("/api/generate", {
      prompt: prompt,
    });
    const imageUrl = response.data.imageUrl;
    setImageUrl(imageUrl);
    console.log("Image URL: ", imageUrl);
  }, [prompt]);

  useEffect(() => {
    if (!imageUrl) return;

    const uploadImage = async () => {
      const response = await axios.post("/api/upload", {
        imageUrl: imageUrl,
      });
      console.log("Image uploaded: ", response.data);
    };

    uploadImage();
  }, [imageUrl]);

  return (
    <>
      <div className="flex min-h-screen w-full overflow-hidden">
        {/* Left side */}
        <div className="w-[25%] border border-white">
          <h1>Private mode</h1>
        </div>

        {/* Right side */}
        <div className="min-w-[75%] w-full p-4 space-y-5">
          <h1 className="text-5xl">AI IMAGE CREATION</h1>
          <div className="flex justify-center items-end gap-2">
            <Textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              rows={10}
              cols={10}
              className={`resize-none rounded-none ${poppins.className}`}
              placeholder="Describe what you want to see!"
            />

            <div className="pb-1">
              <button
                onClick={handleClick}
                className={`bg-[#c0c0c0] text-xl border border-white text-black hover:font-semibold cursor-pointer h-10 w-40`}
              >
                Generate
              </button>
            </div>
          </div>

          <h1 className="text-2xl">Images</h1>
          <Right imageUrl={imageUrl} />
        </div>
      </div>
    </>
  );
}
