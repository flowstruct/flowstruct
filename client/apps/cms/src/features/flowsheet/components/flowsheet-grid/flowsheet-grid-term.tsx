import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { useListData } from 'react-stately';
import { DropIndicator, GridList, GridListItem, ListBox, ListBoxItem, useDragAndDrop } from 'react-aria-components';
import { CourseSummary } from '@/features/course/domain/course.ts';
import { isTextDropItem } from 'react-aria';
import { Stack } from '@/shared/components/layout/stack.tsx';
import { Box } from '@/shared/components/layout/box.tsx';
import Group from '@/shared/components/layout/group.tsx';
import { Text } from '@/shared/components/layout/text.tsx';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete.tsx';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card.tsx';
import styles from './flowsheet-grid-term.module.css';
import { SquarePlus } from 'lucide-react';
import clsx from 'clsx';

type TermListBoxProps = {
  term: number;
  placements: Placement[];
};

export function FlowsheetGridTerm({ term, placements }: TermListBoxProps) {
  const { flowsheetCourses } = useFlowsheetContext();
  const { state } = useFlowsheetGridContext();

  const list = useListData({
    initialItems: placements
  });

  const { dragAndDropHooks } = useDragAndDrop<CourseSummary>({
    getItems(_, items) {
      return items.map((item) => {
        return {
          course: JSON.stringify(item),
          'text/plain': item.name,
        };
      });
    },

    acceptedDragTypes: ['course'],

    getDropOperation: () => 'move',

    async onInsert(e) {
      const processedItems = await Promise.all(
        e.items.filter(isTextDropItem).map(async (item) => JSON.parse(await item.getText('course')))
      );

      if (e.target.dropPosition === 'before') {
        list.insertBefore(e.target.key, ...processedItems);
      } else if (e.target.dropPosition === 'after') {
        list.insertAfter(e.target.key, ...processedItems);
      }
    },

    async onRootDrop(e) {
      const processedItems = await Promise.all(
        e.items.filter(isTextDropItem).map(async (item) => JSON.parse(await item.getText('course')))
      );
      list.append(...processedItems);
    },

    onReorder(e) {
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, e.keys);
      }
    },

    onDragEnd(e) {
      if (e.dropOperation === 'move' && !e.isInternal) {
        list.remove(...e.keys);
      }
    },

    renderDropIndicator: (target) => (
      <DropIndicator
        target={target}
        className={({ isDropTarget }) =>
          clsx(styles.dropIndicator, isDropTarget ? styles.active : '')
        }
      />
    ),

    renderDragPreview: (items) => {
      const firstItem = JSON.parse(items[0].course) as CourseSummary;

      return (
        <div className={styles.dragPreview}>
          {firstItem.code}: {firstItem.name}{' '}
          <span className={styles.dragPreviewItemCount}>{items.length}</span>
        </div>
      );
    },
  });

  return (
    <Stack gap={1}>
      <Box px={1}>
        <Group justify="between">
          <Text tone="dimmed" weight="medium" size="xs">
            Term {term}
          </Text>

          <CourseCatalogAutocomplete term={Number(term)} />
        </Group>
      </Box>

      <GridList
        items={list.items}
        selectionMode="multiple"
        selectedKeys={state.selected}
        dragAndDropHooks={dragAndDropHooks}
        renderEmptyState={() => <EmptyState />}
        aria-label={`Term ${term}`}
        className={styles.listBox}
      >
        {(placement) => {
          if (placement.type === 'COURSE') {
            const course = flowsheetCourses.byIds[placement.item];

            if (!course) return;

            return (
              <GridListItem textValue={course.name} className={styles.listBoxItem}>
                <CourseCard course={course} placement={placement} />
              </GridListItem>
            );
          }
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
