import { PROGRAM_ENDPOINT } from '@/features/program/constants.ts';
import { programKeys } from '@/features/program/queries.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';

const deleteProgram = async (programId: number) =>
  api.delete([PROGRAM_ENDPOINT, programId.toString()]);

export const useDeleteProgram = () =>
  useAppMutation({
    mutationFn: deleteProgram,
    meta: {
      removes: (_, programId) => [programKeys.detail(programId)],
      invalidates: [programKeys.list(), studyPlanKeys.list()],
      successMessage: 'Program deleted.',
    },
  });
