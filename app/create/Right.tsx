import Image from "next/image";
import batman from "../../public/batman.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";

export interface Image {
  id: string;
  url: string;
}

export default function Right() {
  const [image, setImage] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await axios.get("/api/getImages");
      setImage(response.data);
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
