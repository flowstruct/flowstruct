import { Button, Fieldset, Stack } from '@mantine/core';
import { courseSchema } from '@/features/course/schemas.ts';
import { CourseFields } from '@/features/course/components/CourseFields.tsx';
import { Plus } from 'lucide-react';
import { useCoursePreset } from '@/features/course/hooks/useCoursePreset.ts';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { customResolver } from '@/utils/customResolver.ts';
import { modals } from '@mantine/modals';
import { useEditCourseDetails } from '@/features/course/hooks/useEditCourseDetails.ts';
import { canSubmit } from '@/utils/canSubmit';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CourseQuery } from '@/features/course/queries.ts';

interface Props {
  courseId: number;
}

export function EditCourseForm({ courseId }: Props) {
  const { data: course } = useSuspenseQuery(CourseQuery(courseId));

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: customResolver(courseSchema),
    defaultValues: course ?? {},
  });
  const { preset, changePreset } = useCoursePreset(form);
  const editCourseDetails = useEditCourseDetails();

  const onSubmit = form.handleSubmit((data) => {
    editCourseDetails.mutate(
      { courseId: courseId, courseDetails: data },
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
          <CourseFields form={form} preset={preset} changePreset={changePreset} />
        </Fieldset>

        <Button
          disabled={!canSubmit(form)}
          leftSection={<Plus size={18} />}
          type="submit"
          loading={editCourseDetails.isPending}
          fullWidth
        >
          Save Changes
        </Button>
      </Stack>
    </form>
  );
}
