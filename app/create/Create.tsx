"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import Image from "next/image";
import { useCallback, useState } from "react";
import batman from "../../public/batman.jpeg";

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
        <div className="border border-red-500 w-full flex justify-center items-center">
          <div className="border border-black">
            <Image
              src={batman}
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>
        </div>
      </div>
    </>
  );
}
