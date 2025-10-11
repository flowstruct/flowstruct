import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';
import { Button } from '@/shared/components/ui/Button.tsx';
import { X } from 'lucide-react';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';

type CourseCardProps = {
  course: CourseSummary;
  mode?: 'pending' | 'base';
};

export function CourseCard({ course, mode = 'base' }: CourseCardProps) {
  const { unpendCourseFromGrid } = useFlowsheetGridContext();

  return (
    <div data-mode={mode} className={styles.card}>
      {mode === 'pending' && (
        <Button
          size="icon"
          slot="unpend"
          variant="ghost"
          onPress={() => unpendCourseFromGrid(course.id)}
        >
          <X size={14} />
        </Button>
      )}
      <h3 className={styles.code}>{course.code}</h3>
      <p className={styles.name}>{course.name}</p>
    </div>
  );
}
