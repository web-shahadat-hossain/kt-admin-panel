import * as z from "zod";

export const mentorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  mobile: z.string().regex(/^\d+$/, "Mobile must be a valid number"),
  image: z.string().optional(), // Optional image URL
  expertise: z.array(z.string()).min(1, "At least one area of expertise is required"),
  experienceYears: z.number().min(0, "Experience must be at least 0 years"),
  bio: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type MentorFormData = z.infer<typeof mentorSchema>;
