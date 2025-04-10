"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Right from "./Right";

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
      <div className="flex border border-black h-screen ">
        <div className="p-2 border border-black w-[25%] space-y-5">
          <h1>Generate Images</h1>
          <Textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            rows={10}
            cols={10}
            className="resize-none"
            placeholder="Describe what you want to see"
          />
          <Button onClick={handleClick} className="w-full" variant="default">
            Generate
          </Button>
        </div>
        <div className="w-full flex justify-center items-center">
          <Right imageUrl={imageUrl} />
        </div>
      </div>
    </>
  );
}
