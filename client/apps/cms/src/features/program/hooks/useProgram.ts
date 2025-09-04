import { useQuery } from '@tanstack/react-query';
import { ProgramQuery } from '@/features/program/queries.ts';

export const useProgram = (programId: number) => useQuery(ProgramQuery(programId));
