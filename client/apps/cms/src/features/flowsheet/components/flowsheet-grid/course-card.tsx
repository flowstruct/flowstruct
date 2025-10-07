import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';

type CourseCardProps = {
  course: CourseSummary;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.code}>{course.code}</h3>

      <p className={styles.name}>{course.name}</p>
    </div>
  );
}
