import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { programKeys } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/utils/getProgramDisplayName.ts';
import { Program } from '@/features/program/types.ts';
import { api } from '@/shared/api.ts';
import { PROGRAM_ENDPOINT } from '@/features/program/constants.ts';

const createProgram = async (newProgram: Partial<Program>) =>
  api.post<Program>(PROGRAM_ENDPOINT, { body: newProgram });

export const useCreateProgram = () =>
  useAppMutation({
    mutationFn: createProgram,
    meta: {
      setData: (data) => programKeys.detail(data.id),
      invalidates: [programKeys.list()],
      successMessage: (data) => `${getProgramDisplayName(data)} created.`,
    },
  });
