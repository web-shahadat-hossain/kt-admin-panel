import * as z from "zod";

export const subjectSchema = z.object({
  subject: z.string().min(1, "Subject name is required"),
  standard: z.string().optional(),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
