import { BookOpen } from 'lucide-react';
import { CourseSummary } from '@/features/course/domain/course';
import styles from './course-status-icon.module.css';

type CourseStatusIconProps = {
  course: CourseSummary;
};

export function CourseStatusIcon({ course }: CourseStatusIconProps) {
  return (
    <div data-outdated={course.outdatedAt != null ? true : undefined} className={styles.statusIcon}>
      <BookOpen size={15} />
    </div>
  );
}

