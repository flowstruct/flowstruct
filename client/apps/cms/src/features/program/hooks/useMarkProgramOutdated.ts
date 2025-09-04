import { PROGRAM_ENDPOINT } from '@/features/program/constants.ts';
import { programKeys } from '@/features/program/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { Program } from '@/features/program/types.ts';

const markProgramOutdated = (programId: number) =>
  api.put<Program>([PROGRAM_ENDPOINT, programId, 'mark-outdated']);

export const useMarkProgramOutdated = () =>
  useAppMutation({
    mutationFn: markProgramOutdated,
    meta: {
      setData: (data) => programKeys.detail(data.id),
      invalidates: [programKeys.list()],
      successMessage: 'Program marked as outdated.',
    },
  });
