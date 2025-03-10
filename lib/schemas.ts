import { z } from "zod";

export const fillInTheBlanksSchema = z.object({
  question: z.string(),
  answer: z.string(),
  options: z
    .array(z.string())
    .min(6)
    .max(8)
    .describe(
      "Array of 6-8 possible words to fill in the blanks, including the correct answers and distractors"
    ),
});

export type FillInTheBlanks = z.infer<typeof fillInTheBlanksSchema>;

export const questionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths.",
    ),
  answer: z
    .enum(["A", "B", "C", "D"])
    .describe(
      "The correct answer, where A is the first option, B is the second, and so on.",
    ),
});

export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).length(4);
