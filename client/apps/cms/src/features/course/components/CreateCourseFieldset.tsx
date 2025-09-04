import { AppCard } from '@/shared/components/AppCard.tsx';
import { CourseFields } from '@/features/course/components/CourseFields.tsx';
import { courseSchema } from '@/features/course/schemas.ts';
import { getCoursePresetSettings } from '@/utils/getCoursePresetSettings.ts';
import { useCreateCourse } from '@/features/course/hooks/useCreateCourse.ts';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@mantine/core';
import { Plus, X } from 'lucide-react';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { useCoursePreset } from '@/features/course/hooks/useCoursePreset.ts';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { customResolver } from '@/utils/customResolver.ts';

export function CreateCourseFieldset() {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: customResolver(courseSchema),
    defaultValues: {
      code: '',
      name: '',
      isRemedial: false,
      ects: 0,
      ...getCoursePresetSettings('lecture'),
    },
  });

  const { preset, changePreset } = useCoursePreset(form);
  const createCourse = useCreateCourse();
  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((data) => {
    createCourse.mutate(data, {
      onSuccess: () => {
        navigate({
          to: '/catalog/courses',
          search: DefaultSearchValues(),
        });
        form.reset();
      },
    });
  });

  const footer = (
    <>
      <Link to="/catalog/courses" search={DefaultSearchValues()}>
        <Button variant="default" leftSection={<X size={18} />}>
          Cancel
        </Button>
      </Link>

      <Button
        disabled={!form.formState.isValid}
        leftSection={<Plus size={18} />}
        loading={createCourse.isPending}
        type="submit"
      >
        Save Course
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard
        title="Course Details"
        subtitle="Enter the details for the new course"
        footer={footer}
      >
        <CourseFields form={form} preset={preset} changePreset={changePreset} />
      </AppCard>
    </form>
  );
}
