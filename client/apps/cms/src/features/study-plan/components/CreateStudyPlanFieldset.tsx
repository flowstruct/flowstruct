import { AppCard } from '@/shared/components/AppCard.tsx';
import { StudyPlanDetailsFields } from '@/features/study-plan/components/StudyPlanDetailsFields.tsx';
import { studyPlanDetailsSchema } from '@/features/study-plan/schemas.ts';
import { useCreateStudyPlan } from '@/features/study-plan/hooks/useCreateStudyPlan.ts';
import { Link, useNavigate } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { Button } from '@mantine/core';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { customResolver } from '@/utils/customResolver.ts';
import { z } from 'zod/v4';

export function CreateStudyPlanFieldset() {
  const form = useForm<z.infer<typeof studyPlanDetailsSchema>>({
    resolver: customResolver(studyPlanDetailsSchema),
    defaultValues: {
      year: `${new Date().getFullYear()}-01-01`,
      duration: 4,
      track: ''
    },
  });

  const createStudyPlan = useCreateStudyPlan();
  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((data) => {
    createStudyPlan.mutate(
      {
        studyPlanDetails: {
          ...data,
          year: Number(data.year.split('-')[0]),
          program: Number(data.program),
        },
      },
      {
        onSuccess: () => {
          form.reset();
          navigate({ to: '/study-plans', search: DefaultSearchValues() });
        },
      }
    );
  });

  const footer = (
    <>
      <Link search={DefaultSearchValues()} to="/study-plans">
        <Button variant="default" leftSection={<X size={18} />}>
          Cancel
        </Button>
      </Link>

      <Button
        disabled={!form.formState.isValid}
        type="submit"
        leftSection={<Plus size={18} />}
        loading={createStudyPlan.isPending}
      >
        Save Study Plan
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard
        title="Study Plan Details"
        subtitle="Enter the details for the new study plan here"
        footer={footer}
      >
        <StudyPlanDetailsFields form={form} />
      </AppCard>
    </form>
  );
}
