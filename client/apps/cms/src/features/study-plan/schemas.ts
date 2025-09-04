import { z } from 'zod/v4';
import { SectionLevel, SectionType } from '@/features/study-plan/types.ts';

export const studyPlanDetailsSchema = z.object({
  program: z.string().trim().nonempty(),
  year: z.string().trim().nonempty(),
  duration: z.number().min(1, { error: 'Must be at least 1 year' }).default(4),
  track: z.string().trim(),
});

export const sectionDetailsSchema = z.object({
  level: z.enum(SectionLevel),
  type: z.enum(SectionType),
  requiredCreditHours: z.number().nonnegative({ error: 'Must be positive' }),
  name: z.string().trim(),
});

export const requestApprovalSchema = z.object({
  approver: z.string().trim().nonempty(),
  message: z.string().trim().optional()
});