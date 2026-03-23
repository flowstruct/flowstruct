import { courseApi } from '@/features/course/api';
import { CourseSummary } from '@/features/course/domain/course';
import { usePermission } from '@/features/user/hooks/usePermission';
import { userQueries } from '@/features/user/queries';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
} from '@/shared/components/form-modal';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { Button } from '@/shared/components/ui/Button';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Archive, ArchiveRestore, Ellipsis, Folder, Pencil, Save, User } from 'lucide-react';
import React from 'react';
import { CourseFormFields } from './course-form-fields';
import { courseKeys, courseQueries } from '@/features/course/queries';
import styles from './course-action-menu.module.css';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import { SearchOptions } from '@/shared/types';

type CourseActionsMenuProps = {
  course: CourseSummary;
  searchOptions: SearchOptions;
};

export function CourseActionsMenu({ course, searchOptions }: CourseActionsMenuProps) {
  const { data: users } = useSuspenseQuery(userQueries.collection);
  const updatedBy = users.map[course.updatedBy];
  const { hasPermission } = usePermission();
  const isOutdated = course.outdatedAt != null;

  const [editOpen, setEditOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: fullCourse, isPending: isCoursePending } = useQuery({
    ...courseQueries.detail(course.id),
    enabled: editOpen,
  });

  const editCourse = useMutation({
    mutationFn: (data: Partial<CourseSummary>) => courseApi.editCourse(course.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.page(searchOptions) });
    },
    meta: { successMessage: 'Course updated.' },
  });

  const markOutdated = useMutation({
    mutationFn: () => courseApi.markOutdated(course.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.page(searchOptions) });
    },
    meta: { successMessage: 'Course marked as outdated.' },
  });

  const markActive = useMutation({
    mutationFn: () => courseApi.markActive(course.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.page(searchOptions) });
    },
    meta: { successMessage: 'Course marked as active.' },
  });

  const isPending = markOutdated.isPending || markActive.isPending;

  return (
    <>
      <FormModal
        size="md"
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(data) => editCourse.mutate(data as Partial<CourseSummary>)}
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <Folder size={15} /> Courses
              </Breadcrumb>

              <Breadcrumb>
                <Pencil size={15} color="teal" /> Edit course
              </Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>

          <FormModalContent>
            <CourseFormFields isLoading={isCoursePending} defaultValues={fullCourse} />
          </FormModalContent>

          <FormModalFooter>
            <FormModalSubmit isPending={editCourse.isPending}>
              <Save size={15} /> Save
            </FormModalSubmit>
          </FormModalFooter>
        </FormModalBody>
      </FormModal>

      <MenuTrigger>
        <Button shape="icon" variant="ghost" isPending={isPending}>
          <Ellipsis size={15} />
        </Button>

        <Popover hideArrow placement="bottom right" crossOffset={25}>
          <Menu width={200}>
            <MenuItem onAction={() => setEditOpen(true)}>
              <Pencil size={14} /> Edit
            </MenuItem>

            {typeof hasPermission === 'function' &&
              hasPermission('study-plans:archive') &&
              (isOutdated ? (
                <MenuItem onAction={() => markActive.mutate()}>
                  <ArchiveRestore size={14} /> Mark active
                </MenuItem>
              ) : (
                <MenuItem onAction={() => markOutdated.mutate()}>
                  <Archive size={14} /> Mark outdated
                </MenuItem>
              ))}
          </Menu>

          <section className={styles.userActivity}>
            <p>Edited {formatTimeAgo(new Date(course.updatedAt))}</p>
            <div className={styles.userActivityUser}>
              <User size={12} />
              <p>{updatedBy?.username ?? 'Unknown user'}</p>
            </div>
          </section>

          {isOutdated && (
            <section className={styles.statusSection} data-outdated>
              <p>OUTDATED</p>
            </section>
          )}
        </Popover>
      </MenuTrigger>
    </>
  );
}
