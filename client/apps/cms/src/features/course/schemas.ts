import { z } from 'zod/v4';
import { CourseType } from '@/features/course/types.ts';

export const courseSchema = z.object({
  code: z
    .string()
    .trim()
    .nonempty()
    .transform((val) => val.toLocaleUpperCase().replace(/\s+/g, '')),
  name: z.string().trim().nonempty(),
  creditHours: z.number().min(0, { error: 'Must be positive' }),
  ects: z.number().min(0, { error: 'Must be positive' }),
  lectureHours: z.number().min(0, { error: 'Must be positive' }),
  practicalHours: z.number().min(0, { error: 'Must be positive' }),
  type: z.enum(Object.keys(CourseType)),
  isRemedial: z.boolean().default(false),
});
