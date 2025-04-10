import Image from "next/image";
import batman from "../../public/batman.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";

interface Image {
  id: string;
  url: string;
}

export default function Right({ imageUrl }: { imageUrl: string }) {
  const [image, setImage] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await axios.get("/api/getImages");
      console.log("Fetched images: ", response.data[0].url);
      setImage(response.data);
      console.log("Image: ", image);
    };
    fetchImages();
  }, []);

  return (
    <>
      {/* Remove later and use next/image */}
      <div className="grid grid-cols-3 w-[80%] gap-5 p-4">
        {image.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="Fetched Image"
            className="w-full rounded-xl"
          />
        ))}
      </div>
    </>
  );
}
