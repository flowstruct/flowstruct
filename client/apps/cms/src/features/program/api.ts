import { api } from '@/shared/api.ts';
import { Program } from '@/features/program/domain/program.ts';

export const PROGRAM_ENDPOINT = '/programs';

export const programApi = {
  getPrograms: () => api.get<Program[]>(PROGRAM_ENDPOINT),
  getProgram: (programId: number) => api.get<Program>([PROGRAM_ENDPOINT, programId.toString()]),
  createProgram: (details: Partial<Program>) =>
    api.post<Program>([PROGRAM_ENDPOINT], { body: details }),
};
