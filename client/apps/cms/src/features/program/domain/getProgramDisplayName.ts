import { Program } from '@/features/program/domain/program.ts';

export const getProgramDisplayName = (program: Program) =>
  `${program.degree}. ${program.name} (${program.code})`;
