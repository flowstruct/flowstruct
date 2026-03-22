import { DisclosureState } from '@/shared/types';
import React from 'react';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/features/course/api';
import { handleSubmit } from '@/shared/utils/handle-submit';
import styles from './create-course-form.module.css';
import { Switch } from '@/shared/components/ui/Switch';
import { Divider } from '@/shared/components/ui/divider';
import { Button } from '@/shared/components/ui/Button';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { CoursesPage, Course } from '@/features/course/domain/course';
import { courseKeys } from '@/features/course/queries';
import { CourseFormFields } from '@/features/course/components/course-form-fields';

export function CreateCourseForm({
  courseFormState,
  onCourseCreated,
}: {
  courseFormState: DisclosureState;
  onCourseCreated?: (course: Course) => void;
}) {
  const [selectCourse, setSelectCourse] = React.useState<boolean>(true);

  const createCourse = useMutation({
    mutationFn: courseApi.createCourse,
  });

  const queryClient = useQueryClient();

  const onSubmit = handleSubmit((formData, e) => {
    e.stopPropagation();

    createCourse.mutate(formData, {
      onSuccess: (data) => {
        queryClient.setQueriesData<InfiniteData<CoursesPage, number>>(
          { queryKey: courseKeys.catalogs() },
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page, index) =>
                index === 0 ? { ...page, content: [data, ...page.content] } : page
              ),
            };
          }
        );
        if (selectCourse && onCourseCreated) {
          onCourseCreated(data);
        }

        courseFormState.close();
      },
    });
  });

  return (
    <form className={styles.form} id="course-form" onSubmit={onSubmit}>
      <div className={styles.courseFormFields}>
        <CourseFormFields />
      </div>

      <Divider />

      <footer className={styles.courseFormFooter}>
        <Button size="sm" variant="transparent" type="reset" onPress={courseFormState.close}>
          <ChevronLeft size={14} /> Cancel
        </Button>

        <div className={styles.courseFormSubmit}>
          <Switch isSelected={selectCourse} onChange={setSelectCourse}>
            Select after creating
          </Switch>

          <Button
            size="sm"
            variant="primary"
            type="submit"
            form="course-form"
            isPending={createCourse.isPending}
          >
            <BookOpen size={15} /> Create course
          </Button>
        </div>
      </footer>
    </form>
  );
}