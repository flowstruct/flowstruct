import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import styles from './flowsheet-grid.module.css';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { Placement, Term } from '@/features/flowsheet/domain/flowsheet.ts';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import { Grid2X2Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { FlowsheetToolbar } from '@/features/flowsheet/components/flowsheet-grid/flowsheet-toolbar.tsx';
import { createPortal } from 'react-dom';
import Group from '@/shared/components/layout/group.tsx';
import { Stack } from '@/shared/components/layout/stack.tsx';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';

export function FlowsheetGrid() {
  const { terms, createTerm } = useFlowsheetGridContext();

  return (
    <div className={styles.grid}>
      <Group align="start">
        {Object.entries(terms).map(([term, placements]) => (
          <Term
            key={term}
            term={Number(term)}
            placements={placements.sort((a, b) => a.position - b.position)}
          />
        ))}

        <div className={styles.addTermSection}>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="xs"
              shape="icon"
              className={styles.addTermButton}
              onPress={createTerm}
            >
              <Grid2X2Plus size={15} />
            </Button>
            <Tooltip>Add term</Tooltip>
          </TooltipTrigger>
        </div>
      </Group>

      {createPortal(<FlowsheetToolbar />, document.body)}
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
      <Stack>
        <div className={styles.termHeader}>
          <Group justify="between">
            <p>Term {term}</p>
            <CourseCatalogAutocomplete term={Number(term)} />
          </Group>
        </div>

        <Stack>
          {placements?.map((p) => {
            const course = flowsheetCourses.byIds[p.course];
            if (!course) return;

            return <CourseCard key={course.id} course={course} />;
          })}
        </Stack>
      </Stack>
    </section>
  );
}
