import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';
import React from 'react';
import { motion } from 'framer-motion';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton.tsx';
import { Checkbox } from '@/shared/components/ui/Checkbox.tsx';

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
          {isSelected(course.id) && <Checkbox isSelected />}
          <h3 className={styles.code}>{course.code}</h3>
        </header>
        <p className={styles.name}>{course.name}</p>
      </UnstyledButton>
    </motion.div>
  );
}
