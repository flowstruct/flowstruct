import { useSuspenseQuery } from '@tanstack/react-query';
import { ProgramListQuery } from '@/features/program/queries.ts';

export const useProgramList = () => {
  return useSuspenseQuery(ProgramListQuery);
};
