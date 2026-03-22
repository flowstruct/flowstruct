import { api } from '@/shared/api';
import { Program } from '@/features/program/domain/program';

export const PROGRAM_ENDPOINT = '/programs';

export const programApi = {
  getPrograms: () => api.get<Program[]>(PROGRAM_ENDPOINT),

  getProgram: (programId: number) => api.get<Program>([PROGRAM_ENDPOINT, programId.toString()]),

  createProgram: (details: Partial<Program>) =>
    api.post<Program>([PROGRAM_ENDPOINT], { body: details }),

  editProgram: (programId: number, details: Partial<Program>) =>
    api.put<Program>([PROGRAM_ENDPOINT, programId.toString()], { body: details }),

  markOutdated: (programId: number) =>
    api.put<Program>([PROGRAM_ENDPOINT, programId.toString(), 'mark-outdated']),

  markActive: (programId: number) =>
    api.put<Program>([PROGRAM_ENDPOINT, programId.toString(), 'mark-active']),
};
