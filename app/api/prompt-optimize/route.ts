import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

async function PromptOptimize(req: NextRequest) {
  const { prompt } = await req.json();

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a professional prompt engineer for the Flux image generation model. 
Your job is to take short, vague user prompts and expand them into rich, detailed descriptions optimized for Flux. 
Always structure prompts with:
- Subject (main focus)
- Visual details (appearance, clothing, environment, mood)
- Artistic style or camera type (e.g. photorealistic, cinematic, anime, fantasy art, digital painting)
- Lighting and atmosphere (e.g. golden hour, dramatic shadows, neon glow)
- Quality keywords (e.g. ultra-detailed, high resolution, trending on ArtStation, 8k)

Do not add text like "description of" or "caption". 
Only output the final enhanced prompt Flux can directly use.`,
      },
      { role: 'user', content: prompt },
    ],
    model: 'openai/gpt-oss-20b',
  });

  const enhancedPrompt = chatCompletion.choices[0]?.message?.content || '';

  return NextResponse.json({ message: enhancedPrompt });
}

export { PromptOptimize as POST, PromptOptimize as GET };
