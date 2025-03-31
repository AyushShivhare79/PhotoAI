import OpenAI from "openai";
import path from "path";
import fs from "fs";

const testingAPI = async () => {
  const client = new OpenAI({
    baseURL: process.env.FLUX_API_URL,
    apiKey: process.env.FLUX_API_KEY,
  });

  const response = await client.images.generate({
    model: process.env.Model,
    prompt:
      "A futuristic city skyline at sunset, with flying cars and neon lights",
    n: 2,
    size: "1024x1024",
    response_format: "b64_json",
  });
  const imageData = response.data[0].b64_json;
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
  const imageFilename = path.join(
    __dirname,
    `generated_image_${timestamp}.png`
  );

  //@ts-ignore
  fs.writeFileSync(imageFilename, Buffer.from(imageData, "base64"));

  console.log(`✅ Image generated and saved as: ${imageFilename}`);
};

testingAPI();
