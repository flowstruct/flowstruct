import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Box } from '@/shared/components/layout/box.tsx';
import Group from '@/shared/components/layout/group.tsx';
import { Stack } from '@/shared/components/layout/stack.tsx';
import { Text } from '@/shared/components/layout/text.tsx';
import { SquarePlus } from 'lucide-react';
import { GridList, GridListItem } from 'react-aria-components';
import styles from './term.module.css';
import { useTermContext } from '@/features/flowsheet/contexts/term-context';

export function Term() {
  const { flowsheetCourses } = useFlowsheetContext();
  const { state } = useFlowsheetGridContext();
  const { term, dragAndDropHooks } = useTermContext();

  return (
    <Stack gap={1}>
      <Box px={1}>
        <Group justify="between">
          <Text tone="dimmed" weight="medium" size="xs">
            {term.name}
          </Text>

          <CourseCatalogAutocomplete term={Number(term)} />
        </Group>
      </Box>

      <GridList
        items={term.placements}
        selectionMode="multiple"
        selectedKeys={state.selected}
        dragAndDropHooks={dragAndDropHooks}
        renderEmptyState={() => <EmptyState />}
        aria-label={`Term ${term}`}
        className={styles.listBox}
      >
        {(placement) => {
          const course = flowsheetCourses.byIds[placement.course];

          if (!course) return;

          return (
            <GridListItem textValue={course.name} className={styles.listBoxItem}>
              <CourseCard course={course} placement={placement} />
            </GridListItem>
          );
        }}
      </GridList>
    </Stack>
  );
}

function EmptyState() {
  return (
    <Box py={6}>
      <Stack align="center" justify="center">
        <SquarePlus color="gray" size={14} />
        <Text tone="dimmed" size="xs">
          Drop courses here
        </Text>
      </Stack>
    </Box>
  );
}
