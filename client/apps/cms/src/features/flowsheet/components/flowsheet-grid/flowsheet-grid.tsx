import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import styles from './flowsheet-grid.module.css';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import {
  CourseCatalogProvider,
  useCourseCatalogContext,
} from '@/features/course/contexts/course-catalog-context.tsx';

export function FlowsheetGrid() {
  const { terms } = useFlowsheetGridContext();

  return (
    <CourseCatalogProvider>
      <div className={styles.terms}>
        {Object.entries(terms).map(([term, placements]) => (
          <Term key={term} term={Number(term)} placements={placements ?? []} />
        ))}
      </div>
    </CourseCatalogProvider>
  );
}

type TermProps = {
  term: number;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { courses } = useFlowsheetContext();
  const { courseCatalog } = useCourseCatalogContext();
  const { pendingCourses } = useFlowsheetGridContext();

  const pendingCourseCards = Array.from(pendingCourses)
    .filter(([_, v]) => v === term)
    .map(([k, _]) => {
      const course = courseCatalog.get(k);
      if (!course) return;

      return <CourseCard course={course} mode="pending" />;
    });

  const termCourseCards = placements?.sort().map((p) => {
    const course = courses.map[p.course];
    if (!course) return;

    return <CourseCard course={course} />;
  });

  return (
    <section className={styles.term}>
      <div className={styles.termHeader}>
        <p>Term {term}</p>

        <CourseCatalogAutocomplete term={Number(term)} />
      </div>

      <div className={styles.courseCardList}>
        {pendingCourseCards}
        {termCourseCards}
      </div>
    </section>
  );
}
