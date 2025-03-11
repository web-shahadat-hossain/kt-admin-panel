import * as z from 'zod';

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  duration: z.string().min(1, 'Duration is required'),
  features: z.array(z.string().min(1, 'Feature cannot be empty')),
  thumbnail: z.string().url('Must be a valid URL'),
  standard: z.string().min(1, 'Standard is required'),
  subject: z.string().min(1, 'Subject is required'),
  boardId: z.string().min(1, 'Board is required'),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  lessons: z.array(z.string()),
  isActive: z.boolean(),
  bookPDF: z.array(z.string().url('Must be a valid URL')).optional(),
  // Optional field
  bonusPercent: z.number().min(0, 'Price must be 0 or greater').optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
