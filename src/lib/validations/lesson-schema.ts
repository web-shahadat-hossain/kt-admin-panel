import * as z from "zod";

export const lessonSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(100, "Description must be at least 10 characters"),
  materialUrl: z.string().url("Must be a valid URL"),
  materialType: z.enum(["none", "pdf", "video"]),
  isMaterial:z.boolean(),
  isActive: z.boolean(),
});

export type LessonFormData = z.infer<typeof lessonSchema>;