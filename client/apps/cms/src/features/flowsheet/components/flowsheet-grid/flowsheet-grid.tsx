import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import styles from './flowsheet-grid.module.css';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { Placement, Term } from '@/features/flowsheet/domain/flowsheet.ts';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import React from 'react';
import { getFlowsheetTerms } from '@/features/flowsheet/domain/getFlowsheetTerms.ts';
import { Grid2X2Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { motion } from 'framer-motion';

export function FlowsheetGrid() {
  const { flowsheet } = useFlowsheetContext();
  const [createdTerms, setCreatedTerms] = React.useState<number[]>([]);

  const terms = React.useMemo(() => {
    const flowsheetTerms = getFlowsheetTerms(flowsheet);

    const newTerms = createdTerms.reduce(
      (acc, term) => {
        if (!(term in flowsheetTerms)) {
          acc[term] = [];
        }
        return acc;
      },
      {} as Record<Term, Placement[]>
    );

    return { ...flowsheetTerms, ...newTerms };
  }, [flowsheet.placements, createdTerms]);

  return (
    <div className={styles.terms}>
      {Object.entries(terms).map(([term, placements]) => (
        <Term
          key={term}
          term={Number(term)}
          placements={placements.sort((a, b) => a.position - b.position) ?? []}
        />
      ))}

      <motion.div layout className={styles.addTermSection}>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="xs"
            className={styles.addTermButton}
            onPress={() => setCreatedTerms((prev) => [...prev, prev.length + 1])}
          >
            <Grid2X2Plus size={15} />
          </Button>

          <Tooltip>Add term</Tooltip>
        </TooltipTrigger>
      </motion.div>
    </div>
  );
}

type TermProps = {
  term: number;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { flowsheetCourses } = useFlowsheetContext();

  return (
    <section className={styles.term}>
      <div className={styles.termHeader}>
        <p>Term {term}</p>

        <CourseCatalogAutocomplete term={Number(term)} />
      </div>

      <div className={styles.courseCardList}>
        {placements?.map((p) => {
          const course = flowsheetCourses.byIds[p.course];
          if (!course) return;

          return <CourseCard key={course.id} course={course} />;
        })}
      </div>
    </section>
  );
}
