import { Button, Text } from '@mantine/core';
import { ProgramFields } from '@/features/program/components/ProgramFields.tsx';
import { programSchema } from '@/features/program/schemas.ts';
import { useNavigate } from '@tanstack/react-router';
import { Pencil, Trash } from 'lucide-react';
import { useEditProgramDetails } from '@/features/program/hooks/useEditProgramDetails.ts';
import { Program } from '@/features/program/types.ts';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { modals } from '@mantine/modals';
import { useDeleteProgram } from '@/features/program/hooks/useDeleteProgram.ts';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { useForm } from 'react-hook-form';
import { customResolver } from '@/utils/customResolver.ts';
import { z } from 'zod/v4';
import { canSubmit } from '@/utils/canSubmit.ts';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';
import { usePermission } from '@/features/user/hooks/usePermission.ts';

type EditProgramFieldsetProps = {
  program: Program;
};

export function EditProgramFieldset({ program }: EditProgramFieldsetProps) {
  const form = useForm<z.infer<typeof programSchema>>({
    resolver: customResolver(programSchema),
    defaultValues: { ...program },
  });

  const editProgramDetails = useEditProgramDetails();
  const deleteProgram = useDeleteProgram();
  const navigate = useNavigate();

  const { hasPermission } = usePermission();

  const onSubmit = form.handleSubmit((data) => {
    editProgramDetails.mutate(
      {
        programId: program.id,
        editedProgramDetails: data,
      },
      {
        onSuccess: () => {
          navigate({
            to: '/catalog/programs/$programId',
            params: { programId: String(program.id) },
          });
        },
      }
    );
  });

  const handleDelete = () =>
    deleteProgram.mutate(program.id, {
      onSuccess: () =>
        navigate({
          to: '/catalog/programs',
          search: DefaultSearchValues(),
        }),
    });

  return (
    <form onSubmit={onSubmit}>
      <AppCard
        title="Program Information"
        subtitle="Update the details for this program"
        footer={
          <>
            {hasPermission('programs:delete') && (
              <Button
                variant="filled"
                color="red"
                leftSection={<Trash size={18} />}
                onClick={() =>
                  modals.openConfirmModal({
                    title: <ModalHeader title="Please Confirm Your Action" />,
                    children: (
                      <Text size="sm">
                        Deleting this program will delete all of its study plans. Are you absolutely
                        sure?
                      </Text>
                    ),
                    labels: { confirm: 'Confirm', cancel: 'Cancel' },
                    onConfirm: handleDelete,
                  })
                }
                loading={deleteProgram.isPending}
              >
                Delete Program
              </Button>
            )}

            <Button
              ml="auto"
              disabled={!canSubmit(form)}
              type="submit"
              leftSection={<Pencil size={18} />}
              loading={editProgramDetails.isPending}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <ProgramFields form={form} />
      </AppCard>
    </form>
  );
}
