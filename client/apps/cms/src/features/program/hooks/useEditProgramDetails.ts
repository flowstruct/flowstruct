import { PROGRAM_ENDPOINT } from '@/features/program/constants.ts';
import { programKeys } from '@/features/program/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { getProgramDisplayName } from '@/utils/getProgramDisplayName.ts';
import { Program } from '@/features/program/types.ts';
import { api } from '@/shared/api.ts';

const editProgramDetails = async ({
  programId,
  editedProgramDetails,
}: {
  programId: number;
  editedProgramDetails: Partial<Program>;
}) => api.put<Program>([PROGRAM_ENDPOINT, programId.toString()], { body: editedProgramDetails });

export const useEditProgramDetails = () =>
  useAppMutation({
    mutationFn: editProgramDetails,
    meta: {
      setData: (data) => programKeys.detail(data.id),
      invalidates: [programKeys.list()],
      successMessage: (data) => `Edited ${getProgramDisplayName(data)} details.`,
    },
  });
