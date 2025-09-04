import { StudyPlan } from '@/features/study-plan/types.ts';
import { studyPlanDetailsSchema } from '@/features/study-plan/schemas.ts';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { StudyPlanDetailsFields } from '@/features/study-plan/components/StudyPlanDetailsFields.tsx';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button, Text } from '@mantine/core';
import { ChevronLeft, Pencil, Trash } from 'lucide-react';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { useEditStudyPlanDetails } from '@/features/study-plan/hooks/useEditStudyPlanDetails.ts';
import { useDeleteStudyPlan } from '@/features/study-plan/hooks/useDeleteStudyPlan.ts';
import { modals } from '@mantine/modals';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { customResolver } from '@/utils/customResolver.ts';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';

type Props = {
  studyPlan: StudyPlan;
};

export function EditStudyPlanDetailsFieldset({ studyPlan }: Props) {
  const form = useForm<z.infer<typeof studyPlanDetailsSchema>>({
    resolver: customResolver(studyPlanDetailsSchema),
    defaultValues: {
      ...studyPlan,
      program: String(studyPlan.program),
      year: `${studyPlan.year}-01-01`,
    },
  });

  const editStudyPlanDetails = useEditStudyPlanDetails();
  const deleteStudyPlan = useDeleteStudyPlan();

  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((data) => {
    editStudyPlanDetails.mutate(
      {
        studyPlanId: studyPlan.id,
        studyPlanDetails: {
          ...data,
          year: Number(data.year.split('-')[0]),
          program: Number(data.program),
        },
      },
      {
        onSuccess: () => {
          navigate({
            to: '/study-plans/$studyPlanId/details',
            params: { studyPlanId: String(studyPlan.id) },
          });
        },
      }
    );
  });

  const handleDelete = () =>
    deleteStudyPlan.mutate(studyPlan.id, {
      onSuccess: () =>
        navigate({
          to: '/study-plans',
          search: DefaultSearchValues(),
        }),
    });

  const footer = (
    <>
      <Button
        variant="filled"
        color="red"
        leftSection={<Trash size={18} />}
        onClick={() =>
          modals.openConfirmModal({
            title: <ModalHeader title="Please Confirm Your Action" />,
            children: (
              <Text size="sm">
                Deleting this study plan will delete all of its sections, program map, and overview,
                are you absolutely sure?
              </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: handleDelete,
          })
        }
        loading={deleteStudyPlan.isPending}
      >
        Delete Study Plan
      </Button>

      <Button
        disabled={!form.formState.isValid || !form.formState.isDirty}
        type="submit"
        leftSection={<Pencil size={18} />}
        loading={editStudyPlanDetails.isPending}
      >
        Save Changes
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard
        title="Study Plan Information"
        subtitle="Update the details for this study plan"
        footer={footer}
        headerAction={
          <Link
            to="/study-plans/$studyPlanId/details"
            params={{ studyPlanId: String(studyPlan.id) }}
          >
            <Button variant="default" leftSection={<ChevronLeft size={18} />}>
              Back
            </Button>
          </Link>
        }
      >
        <StudyPlanDetailsFields disableProgramSelect={true} form={form} />
      </AppCard>
    </form>
  );
}
