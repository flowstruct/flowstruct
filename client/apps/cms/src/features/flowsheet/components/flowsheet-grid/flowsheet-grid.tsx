import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import styles from './flowsheet-grid.module.css';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';

export function FlowsheetGrid() {
  const { flowsheet, courses } = useFlowsheetContext();

  const terms = Object.groupBy(flowsheet.placements, (p) => p.term);

  return (
    <div className={styles.terms}>
      {Object.entries(terms).map(([term, placements]) => {
        return (
          <section className={styles.term}>
            <p className={styles.termHeader} key={term}>
              Term {term}
            </p>

            <div className={styles.termCourseCards}>
              {placements?.sort().map((p) => {
                const course = courses.map[p.course];
                if (!course) return;

                return <CourseCard course={course} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
