import * as z from 'zod';

export const quizFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
  standard: z
    .string()
    .min(null, 'Standard is required')
    .optional()
    .nullable()
    .default(null),
  subject: z
    .string()
    .min(null, 'Subject is required')
    .optional()
    .nullable()
    .default(null),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  duration: z
    .number()
    .min(0, 'Duration is not less then 0.')
    .max(480, 'Duration cannot exceed 8 hours')
    .default(0)
    .optional(),
  ageGroup: z.string().min(0, 'Age group is required').optional(),
  price: z.number().min(0, 'Price cannot be negative').default(0),
  bonusPercent: z.number().min(0, 'Refer bonus cannot be negative').optional(),
  isActive: z.boolean().default(true),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Question text is required'),
        options: z
          .array(
            z.object({
              option: z.string().min(1, 'Option text is required'),
              isCorrect: z.boolean(),
            })
          )
          .min(2, 'At least two options are required'),
      })
    )
    .min(1, 'At least one question is required'),
});

export type QuizFormSchema = z.infer<typeof quizFormSchema>;
