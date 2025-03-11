import * as z from "zod";

export const offerFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  offrPer: z.number().min(0).max(100),
  startAt: z.date(),
  endAt: z.date(),
  courses: z.array(z.string()).default([]),
  quizzes: z.array(z.string()).default([]),
});

export type OfferFormSchema = z.infer<typeof offerFormSchema>;
