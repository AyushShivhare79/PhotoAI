import { z } from "zod";

export const FormSchema = z.object({
  prompt: z
    .string({ message: "Prompt is required." })
    .min(10, {
      message: "Prompt must be at least 10 characters.",
    })
    .max(500, {
      message: "Prompt must not be longer than 500 characters.",
    }),
});
