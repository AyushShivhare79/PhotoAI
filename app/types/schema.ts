import { z } from "zod";

export const promptSchema = z.object({
  prompt: z
    .string({ message: "Prompt is required." })
    .min(10, {
      message: "Prompt must be at least 10 characters.",
    })
    .max(1000, {
      message: "Prompt must not be longer than 500 characters.",
    }),
});

export type PromptSchema = z.infer<typeof promptSchema>;
