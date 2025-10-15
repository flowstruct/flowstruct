import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';
import React from 'react';
import { motion } from 'framer-motion';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton.tsx';
import { Checkbox } from '@/shared/components/ui/Checkbox.tsx';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { EllipsisVertical, TagIcon, X } from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';

type CourseCardProps = {
  course: CourseSummary;
  mode?: 'pending' | 'base';
  action?: React.ReactNode;
};

export function CourseCard({ course, mode = 'base', action }: CourseCardProps) {
  const { toggleSelectCourse, isSelected } = useFlowsheetGridContext();

  return (
    <motion.div layout layoutId={String(course.id)} className={styles.wrapper}>
      <UnstyledButton
        data-selected={isSelected(course.id) ? true : undefined}
        data-mode={mode}
        className={styles.card}
        onPress={() => toggleSelectCourse(course.id)}
      >
        {action && action}

        <header className={styles.header}>
          <div className={styles.headerGroup}>
            {isSelected(course.id) && <Checkbox isSelected />}

            <h3 className={styles.code}>{course.code}</h3>
          </div>

          <CourseMenu course={course} />
        </header>

        <p className={styles.name}>{course.name}</p>
      </UnstyledButton>
    </motion.div>
  );
}

type CourseMenuProps = {
  course: CourseSummary;
};

function CourseMenu({ course }: CourseMenuProps) {
  const { flowsheet } = useFlowsheetContext();

  const removeCourse = useMutation({
    mutationFn: () =>
      flowsheetApi.removeCourses({ flowsheetId: flowsheet.id, courseIds: [course.id] }),
    mutationKey: ['flowsheet-courses', course.id],
  });

  return (
    <MenuTrigger>
      <Button variant="ghost" size="icon">
        <EllipsisVertical size={12} />
      </Button>

      <Popover placement="bottom right" crossOffset={24}>
        <Menu>
          <MenuItem>
            <TagIcon size={14} /> Assign section
          </MenuItem>

          <MenuItem onPress={() => removeCourse.mutate()}>
            <X color="red" size={14} /> Remove
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
