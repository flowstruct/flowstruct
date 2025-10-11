import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import styles from './flowsheet-grid.module.css';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import {
  CatalogCoursesProvider,
  useCatalogCoursesContext,
} from '@/features/course/contexts/catalog-courses-context.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { BetweenHorizontalStart } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';

export function FlowsheetGrid() {
  const { terms } = useFlowsheetGridContext();

  return (
    <CatalogCoursesProvider>
      <div className={styles.terms}>
        {Object.entries(terms).map(([term, placements]) => (
          <Term key={term} term={Number(term)} placements={placements ?? []} />
        ))}
      </div>
    </CatalogCoursesProvider>
  );
}

type TermProps = {
  term: number;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { flowsheet, flowsheetCourses } = useFlowsheetContext();
  const { catalogCourses } = useCatalogCoursesContext();
  const { pendingCourses, unpendAllCoursesFromTerm } = useFlowsheetGridContext();

  const placeCourses = useMutation({
    mutationFn: () =>
      flowsheetApi.placeCourses({
        flowsheetId: flowsheet.id,
        courseIds: Array.from(pendingCourses.keys()),
        term,
      }),
    onSuccess: () => {
      unpendAllCoursesFromTerm(term);
    },
  });

  const pendingCourseCards = Array.from(pendingCourses)
    .filter(([_, v]) => v === term)
    .map(([k, _]) => {
      const course = catalogCourses.get(k);
      if (!course) return;

      return <CourseCard key={k} course={course} mode="pending" />;
    });

  const termCourseCards = placements?.sort().map((p) => {
    const course = flowsheetCourses.byIds[p.course];
    if (!course) return;

    return <CourseCard key={course.id} course={course} />;
  });

  return (
    <section className={styles.term}>
      <div className={styles.termHeader}>
        <p>Term {term}</p>

        <CourseCatalogAutocomplete term={Number(term)} />
      </div>

      <div className={styles.courseCardList}>
        {pendingCourseCards}
        {pendingCourseCards.length !== 0 && (
          <Button
            variant="transparent"
            size="sm"
            isPending={placeCourses.isPending}
            className={styles.placeCoursesButton}
            onPress={() => placeCourses.mutate()}
          >
            <BetweenHorizontalStart size={14} /> Place courses
          </Button>
        )}

        {termCourseCards}
      </div>
    </section>
  );
}
