import { useSuspenseQuery } from '@tanstack/react-query';
import { ProgramQuery } from '@/features/program/queries.ts';
import { useParamId } from '@/shared/hooks/useParamId.ts';

export const useCurrentProgram = (fallbackProgramId?: number) => {
  const programId = useParamId({ paramKey: 'programId', fallback: fallbackProgramId });
  return useSuspenseQuery(ProgramQuery(programId));
};
