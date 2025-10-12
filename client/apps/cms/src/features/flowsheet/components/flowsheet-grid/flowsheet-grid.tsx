import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import styles from './flowsheet-grid.module.css';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import {
  FlowsheetGridProvider,
  useFlowsheetGridContext,
} from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { BetweenHorizontalStart, X } from 'lucide-react';
import React from 'react';
import { getFlowsheetTerms } from '@/features/flowsheet/domain/getFlowsheetTerms.ts';
import { ProgressCircle } from '@/shared/components/ui/ProgressCircle.tsx';
import { useCatalogCoursesCache } from '@/features/course/hooks/use-catalog-courses-cache.ts';

export function FlowsheetGrid() {
  const { flowsheet } = useFlowsheetContext();

  const terms = React.useMemo(() => getFlowsheetTerms(flowsheet), [flowsheet.placements]);

  return (
    <FlowsheetGridProvider>
      <div className={styles.terms}>
        {Object.entries(terms).map(([term, placements]) => (
          <Term key={term} term={Number(term)} placements={placements ?? []} />
        ))}
      </div>
    </FlowsheetGridProvider>
  );
}

type TermProps = {
  term: number;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { flowsheetCourses } = useFlowsheetContext();
  const { pendingCourses, placeCourses, unpendCourseFromGrid } = useFlowsheetGridContext();
  const catalogCoursesCache = useCatalogCoursesCache();

  const pendingCourseCards = Array.from(pendingCourses)
    .filter(([_, v]) => v === term)
    .map(([k, _]) => {
      const course = catalogCoursesCache.get(k);
      if (!course) return;

      return (
        <CourseCard
          key={k}
          course={course}
          action={
            placeCourses.isPending ? (
              <ProgressCircle isIndeterminate />
            ) : (
              <Button
                size="icon"
                slot="actions"
                variant="ghost"
                onPress={() => unpendCourseFromGrid(course.id)}
              >
                <X size={14} />
              </Button>
            )
          }
        />
      );
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

        {pendingCourseCards.length !== 0 && !placeCourses.isPending && (
          <Button
            variant="transparent"
            size="sm"
            className={styles.placeCoursesButton}
            onPress={() => placeCourses.mutate(term)}
          >
            <BetweenHorizontalStart size={14} /> Place courses
          </Button>
        )}

        {termCourseCards}
      </div>
    </section>
  );
}
