import { StudyPlanDetailsFields } from '@/features/study-plan/components/StudyPlanDetailsFields.tsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { studyPlanDetailsSchema } from '@/features/study-plan/schemas.ts';
import { customResolver } from '@/utils/customResolver.ts';
import { StudyPlanSummary } from '@/features/study-plan/types.ts';
import { useCloneStudyPlan } from '@/features/study-plan/hooks/useCloneStudyPlan.ts';
import { Button, Fieldset, Group, LoadingOverlay, Stack } from '@mantine/core';
import { CopyPlus, X } from 'lucide-react';
import { modals } from '@mantine/modals';
import { Suspense } from 'react';

type Props = {
  studyPlanToClone: StudyPlanSummary;
};

export function CloneStudyPlanDetailsForm({ studyPlanToClone }: Props) {
  const form = useForm<z.infer<typeof studyPlanDetailsSchema>>({
    resolver: customResolver(studyPlanDetailsSchema),
    defaultValues: {
      ...studyPlanToClone,
      program: String(studyPlanToClone.program),
      year: `${studyPlanToClone.year}-01-01`,
      track: `${studyPlanToClone.track ? studyPlanToClone.track + ' - ' : studyPlanToClone.track}Copy`,
    },
  });

  const cloneStudyPlan = useCloneStudyPlan();

  const onSubmit = form.handleSubmit((data) => {
    cloneStudyPlan.mutate(
      {
        studyPlanToCloneId: studyPlanToClone.id,
        cloneDetails: {
          ...data,
          year: Number(data.year.split('-')[0]),
          program: Number(data.program),
        },
      },
      {
        onSuccess: () => {
          modals.closeAll();
        },
      }
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Fieldset variant="filled">
          <Suspense
            fallback={<LoadingOverlay visible zIndex={1000} loaderProps={{ type: 'bars' }} />}
          >
            <StudyPlanDetailsFields form={form} disableProgramSelect={true} />
          </Suspense>
        </Fieldset>

        <Group justify="space-between">
          <Button onClick={() => modals.closeAll()} variant="default" leftSection={<X size={18} />}>
            Cancel
          </Button>

          <Button
            loading={cloneStudyPlan.isPending}
            type="submit"
            leftSection={<CopyPlus size={18} />}
          >
            Clone to New Study Plan
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
