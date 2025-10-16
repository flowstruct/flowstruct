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
import { DropIndicator } from '@/features/flowsheet/components/flowsheet-grid/drop-indicator.tsx';
import { Text } from '@/shared/components/layout/text.tsx';
import { Box } from '@/shared/components/layout/box.tsx';

export function FlowsheetGrid() {
  const { terms, createTerm } = useFlowsheetGridContext();

  return (
    <Box overflow="auto" overflowY="hidden">
      <Group align="start">
        {Object.entries(terms).map(([term, placements]) => (
          <Term
            key={term}
            term={Number(term)}
            placements={placements.sort((a, b) => a.position - b.position)}
          />
        ))}

        <Box position="relative">
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
        </Box>
      </Group>

      {createPortal(<FlowsheetToolbar />, document.body)}
    </Box>
  );
}

type TermProps = {
  term: number;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { flowsheetCourses } = useFlowsheetContext();

  return (
    <div className={styles.term}>
      <Stack gap={1}>
        <Box px={1}>
          <Group justify="between">
            <Text tone="dimmed" weight="medium" size="xs">
              Term {term}
            </Text>

            <CourseCatalogAutocomplete term={Number(term)} />
          </Group>
        </Box>

        <Stack>
          {placements?.map((p) => {
            const course = flowsheetCourses.byIds[p.course];
            if (!course) return;

            return (
              <Box key={course.id} position="relative">
                <DropIndicator term={term} position={p.position} />
                <CourseCard course={course} />
              </Box>
            );
          })}

          <Box position="relative">
            <DropIndicator term={term} position={placements.length + 1} />
          </Box>
        </Stack>
      </Stack>
    </div>
  );
}
