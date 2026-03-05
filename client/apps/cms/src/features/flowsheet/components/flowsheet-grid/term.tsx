import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { Box } from '@/shared/components/layout/box.tsx';
import Group from '@/shared/components/layout/group.tsx';
import { Stack } from '@/shared/components/layout/stack.tsx';
import { Text } from '@/shared/components/layout/text.tsx';
import { SquarePlus } from 'lucide-react';
import styles from './term.module.css';
import { useTermContext } from '@/features/flowsheet/contexts/term-context.tsx';
import { useDelayedSkeleton } from '@/shared/hooks/use-delayed-skeleton';
import { flowsheetQueries } from '../../queries';
import { Placement } from '@/features/flowsheet/domain/flowsheet';
import { getTermDisplayName } from '@/features/flowsheet/domain/getTermDisplayName';

export function Term() {
  const { term } = useTermContext();

  return (
    <Stack gap={1}>
      <Box px={1}>
        <Group justify="between">
          <Text tone="dimmed" weight="medium" size="xs">
            {getTermDisplayName(term)}
          </Text>

          <CourseCatalogAutocomplete />
        </Group>
      </Box>

      <div className={styles.placements}>
        {term.placements.map((p) => (
          <PlacementCard key={p.course} placement={p} />
        ))}
      </div>
    </Stack>
  );
}

type PlacementCardProps = {
  placement: Placement;
};

function PlacementCard({ placement }: PlacementCardProps) {
  const { flowsheet, flowsheetCourses } = useFlowsheetContext();
  const showSkeleton = useDelayedSkeleton(flowsheetQueries.courseCollection(flowsheet.id));
  const course = flowsheetCourses.byIds[placement.course];

  if (!course) {
    return showSkeleton && <div className={styles.skeletonCard} />;
  }

  return <CourseCard course={course} placement={placement} />;
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
