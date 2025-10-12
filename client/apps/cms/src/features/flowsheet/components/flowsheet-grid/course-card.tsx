import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';
import React from 'react';

type CourseCardProps = {
  course: CourseSummary;
  mode?: 'pending' | 'base';
  action?: React.ReactNode;
};

export function CourseCard({ course, mode = 'base', action }: CourseCardProps) {
  return (
    <div data-mode={mode} className={styles.card}>
      {action && action}
      <h3 className={styles.code}>{course.code}</h3>
      <p className={styles.name}>{course.name}</p>
    </div>
  );
}
