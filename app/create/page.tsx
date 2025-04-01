"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useCallback, useState } from "react";

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
        <div className="border border-black w-full">
          <img src={imageUrl} />
        </div>
      </div>
    </>
  );
}
