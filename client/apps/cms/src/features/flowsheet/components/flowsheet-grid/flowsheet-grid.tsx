import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import styles from './flowsheet-grid.module.css';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { CourseCatalogFinder } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-finder.tsx';

export function FlowsheetGrid() {
  const { flowsheet } = useFlowsheetContext();

  const terms = Object.groupBy(flowsheet.placements, (p) => p.term);

  if (Object.keys(terms).length === 0) {
    terms[1] = [];
  }

  return (
    <div className={styles.terms}>
      {Object.entries(terms).map(([term, placements]) => (
        <Term key={term} term={term} placements={placements ?? []} />
      ))}
    </div>
  );
}

type TermProps = {
  term: string;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { courses } = useFlowsheetContext();

  return (
    <section className={styles.term}>
      <p className={styles.termHeader}>Term {term}</p>

      <div className={styles.termCourseCards}>
        {placements?.sort().map((p) => {
          const course = courses.map[p.course];
          if (!course) return;

          return <CourseCard course={course} />;
        })}

        <CourseCatalogFinder term={Number(term)} />
      </div>
    </section>
  );
}
