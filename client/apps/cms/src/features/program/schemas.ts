import { z } from 'zod/v4';
import { Degree } from '@/features/program/types.ts';

export const programSchema = z.object({
  code: z
    .string()
    .trim()
    .nonempty()
    .transform((val) => val.toLocaleUpperCase().replace(/\s+/g, '')),
  name: z.string().trim().nonempty(),
  degree: z.enum(Object.keys(Degree)),
});
