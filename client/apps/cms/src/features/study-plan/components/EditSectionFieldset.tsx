import { AppCard } from '@/shared/components/AppCard.tsx';
import { SectionDetailsFields } from '@/features/study-plan/components/SectionDetailsFields.tsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { sectionDetailsSchema } from '@/features/study-plan/schemas.ts';
import { customResolver } from '@/utils/customResolver.ts';
import { Section } from '@/features/study-plan/types.ts';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@mantine/core';
import { useDeleteSection } from '@/features/study-plan/hooks/useDeleteSection.ts';
import { useNavigate, useParams } from '@tanstack/react-router';
import { DefaultFrameworkCoursesSearchValues } from '@/utils/defaultFrameworkCoursesSearchValues.ts';
import { useEditSectionDetails } from '@/features/study-plan/hooks/useEditSectionDetails.ts';

type Props = {
  section: Section;
};

export function EditSectionFieldset({ section }: Props) {
  const { studyPlanId } = useParams({
    from: '/_layout/study-plans/$studyPlanId/sections/$sectionId/edit',
  });
  const form = useForm<z.infer<typeof sectionDetailsSchema>>({
    resolver: customResolver(sectionDetailsSchema),
    defaultValues: { ...section },
  });
  const navigate = useNavigate();

  const editSection = useEditSectionDetails();
  const deleteSection = useDeleteSection();

  const backToSections = () =>
    navigate({
      to: '/study-plans/$studyPlanId/sections',
      params: { studyPlanId },
      search: DefaultFrameworkCoursesSearchValues(),
    });

  const onSubmit = form.handleSubmit((data) => {
    editSection.mutate(
      {
        studyPlanId: Number(studyPlanId),
        sectionId: section.id,
        sectionDetails: { ...data },
      },
      {
        onSuccess: () => backToSections(),
      }
    );
  });

  const handleDelete = () =>
    deleteSection.mutate(
      {
        studyPlanId: Number(studyPlanId),
        sectionId: section.id,
      },
      {
        onSuccess: () => backToSections(),
      }
    );

  const footer = (
    <>
      <Button
        loading={deleteSection.isPending}
        color="red"
        leftSection={<Trash size={18} />}
        onClick={handleDelete}
      >
        Delete Section
      </Button>

      <Button
        loading={editSection.isPending}
        disabled={!form.formState.isValid || !form.formState.isDirty}
        leftSection={<Pencil size={18} />}
        type="submit"
      >
        Save Changes
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard title="Section Details" subtitle="Edit section details here" footer={footer}>
        <SectionDetailsFields form={form} />
      </AppCard>
    </form>
  );
}
