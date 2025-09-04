import { Course } from '@/features/course/types.ts';
import { courseSchema } from '@/features/course/schemas.ts';
import { useEditCourseDetails } from '@/features/course/hooks/useEditCourseDetails.ts';
import { useNavigate } from '@tanstack/react-router';
import { CourseFields } from '@/features/course/components/CourseFields.tsx';
import { Box, Button } from '@mantine/core';
import { Pencil } from 'lucide-react';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { useCoursePreset } from '@/features/course/hooks/useCoursePreset.ts';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { customResolver } from '@/utils/customResolver.ts';

type Props = {
  course: Course;
};

export function EditCourseFieldset({ course }: Props) {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: customResolver(courseSchema),
    defaultValues: { ...course },
  });
 1
  const { preset, changePreset } = useCoursePreset(form);
  const editCourseDetails = useEditCourseDetails();
  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((data) => {
    editCourseDetails.mutate(
      {
        courseId: course.id,
        courseDetails: data,
      },
      {
        onSuccess: () =>
          navigate({
            to: '/catalog/courses/$courseId',
            params: { courseId: String(course.id) },
          }),
      }
    );
  });

  const footer = (
    <Box ml="auto">
      <Button
        disabled={!form.formState.isValid || !form.formState.isDirty}
        loading={editCourseDetails.isPending}
        type="submit"
        leftSection={<Pencil size={18} />}
      >
        Save Changes
      </Button>
    </Box>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard
        title="Course Information"
        subtitle="Update the details for this course"
        footer={footer}
      >
        <CourseFields form={form} preset={preset} changePreset={changePreset} />
      </AppCard>
    </form>
  );
}
