import { sectionDetailsSchema } from '@/features/study-plan/schemas.ts';
import { useCreateSection } from '@/features/study-plan/hooks/useCreateSection.ts';
import { useNavigate, useParams } from '@tanstack/react-router';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { SectionDetailsFields } from '@/features/study-plan/components/SectionDetailsFields.tsx';
import { Button } from '@mantine/core';
import { CancelButton } from '@/shared/components/CancelButton.tsx';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { customResolver } from '@/utils/customResolver.ts';
import { DefaultFrameworkCoursesSearchValues } from '@/utils/defaultFrameworkCoursesSearchValues.ts';

export function CreateSectionFieldset() {
  const form = useForm<z.infer<typeof sectionDetailsSchema>>({
    resolver: customResolver(sectionDetailsSchema),
    defaultValues: {
      name: '',
      requiredCreditHours: 0,
      level: undefined,
      type: undefined,
    },
  });
  const createSection = useCreateSection();
  const navigate = useNavigate();

  const { studyPlanId } = useParams({ from: '/_layout/study-plans/$studyPlanId' });

  const backToSections = () =>
    navigate({
      to: '/study-plans/$studyPlanId/sections',
      params: { studyPlanId },
      search: DefaultFrameworkCoursesSearchValues(),
    });

  const onSubmit = form.handleSubmit((data) => {
    createSection.mutate(
      {
        studyPlanId: Number(studyPlanId),
        sectionDetails: data,
      },
      {
        onSuccess: () => {
          form.reset();
          backToSections();
        },
      }
    );
  });

  const footer = () => (
    <>
      <CancelButton onClick={backToSections} />

      <Button
        disabled={!form.formState.isValid}
        type="submit"
        leftSection={<Plus size={18} />}
        loading={createSection.isPending}
      >
        Create Section
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard title="Section Details" subtitle="Enter new section details here" footer={footer()}>
        <SectionDetailsFields form={form} />
      </AppCard>
    </form>
  );
}
