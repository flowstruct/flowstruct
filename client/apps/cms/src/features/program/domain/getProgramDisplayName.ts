import { Program } from '@/features/program/domain/program.ts';

export const getProgramDisplayName = (program: Pick<Program, 'degree' | 'name' | 'code'>) =>
  `${program.degree}. ${program.name} (${program.code})`;
