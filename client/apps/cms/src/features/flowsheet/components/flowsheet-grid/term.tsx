import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { Box } from '@/shared/components/layout/box';
import Group from '@/shared/components/layout/group';
import { Stack } from '@/shared/components/layout/stack';
import { Text } from '@/shared/components/layout/text';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api';
import { Ellipsis, SquarePlus, X } from 'lucide-react';
import styles from './term.module.css';
import { useTermContext } from '@/features/flowsheet/contexts/term-context';
import { useDelayedSkeleton } from '@/shared/hooks/use-delayed-skeleton';
import { flowsheetQueries } from '../../queries';
import { Placement } from '@/features/flowsheet/domain/flowsheet';
import { getTermDisplayName } from '@/features/flowsheet/domain/getTermDisplayName';
import { Button } from '@/shared/components/ui/Button';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';

export function Term() {
  const { term } = useTermContext();

  return (
    <Stack gap={1}>
      <Box px={1}>
        <Group justify="between">
          <Text tone="dimmed" weight="medium" size="xs">
            {getTermDisplayName(term)}
          </Text>

          <TermOptions />
        </Group>
      </Box>

      <div className={styles.placements}>
        {term.placements.map((p) => (
          <PlacementCard key={p.course} placement={p} />
        ))}
      </div>

      <CourseCatalogAutocomplete />
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

function TermOptions() {
  const { term } = useTermContext();
  const { flowsheet } = useFlowsheetContext();

  const deleteTerm = useMutation({
    mutationFn: () => flowsheetApi.deleteTerm({ flowsheetId: flowsheet.id, termId: term.id }),
  });

  return (
    <MenuTrigger>
      <Button variant="ghost" size="none" isPending={deleteTerm.isPending}>
        <Ellipsis size={15} />
      </Button>

      <Popover placement="bottom end">
        <Menu>
          <MenuItem onAction={() => deleteTerm.mutate()}>
            <X color="red" size={14} />
            <span>Delete</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
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
