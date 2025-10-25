import { DropIndicator, ListBox, ListBoxItem, useDragAndDrop } from 'react-aria-components';
import { isTextDropItem } from 'react-aria';
import styles from './term.module.css';
import clsx from 'clsx';
import type { Placement, Term } from '../../domain/flowsheet.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { Box } from '../layout/box.tsx';
import { Text } from '../layout/text.tsx';
import { CoursePlacement } from './course-placement.tsx';
import { AddCoursePlacement } from './add-course-placement.tsx';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import {
  appendPlacementsToTerm,
  insertPlacementsInTerm,
  removePlacementsFromTerm,
  reorderPlacementsInTerm,
} from '../../domain/placement.ts';
import { CopyPlus } from 'lucide-react';
import Group from '../layout/group.tsx';

type TermProps = {
  term: Term;
};

export function Term({ term }: TermProps) {
  const { flowsheet, setFlowsheet } = useFlowsheet();
  const { selectedPlacements } = useFlowsheetGrid();

  const { dragAndDropHooks } = useDragAndDrop<Placement>({
    getItems(_, items) {
      return items.map((item) => {
        return {
          placement: JSON.stringify(item),
          'text/plain': item.id,
        };
      });
    },

    acceptedDragTypes: ['placement'],

    getDropOperation: () => 'move',

    async onInsert(e) {
      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) => JSON.parse(await item.getText('placement')))
      );

      const updatedFlowsheet = insertPlacementsInTerm({
        flowsheet,
        termIndex: term.index,
        placements: processedItems,
        targetPlacementId: e.target.key as string,
        position: e.target.dropPosition === 'before' ? 'before' : 'after',
      });

      setFlowsheet(updatedFlowsheet);
    },

    async onRootDrop(e) {
      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) => JSON.parse(await item.getText('placement')))
      );

      const updatedFlowsheet = appendPlacementsToTerm({
        flowsheet,
        termIndex: term.index,
        placements: processedItems,
      });

      setFlowsheet(updatedFlowsheet);
    },

    onReorder(e) {
      const updatedFlowsheet = reorderPlacementsInTerm({
        flowsheet,
        termIndex: term.index,
        placementIds: Array.from(e.keys) as string[],
        targetPlacementId: e.target.key as string,
        position: e.target.dropPosition === 'before' ? 'before' : 'after',
      });

      setFlowsheet(updatedFlowsheet);
    },

    onDragEnd(e) {
      if (e.dropOperation === 'move' && !e.isInternal) {
        const updatedFlowsheet = removePlacementsFromTerm({
          flowsheet,
          termIndex: term.index,
          placementIds: Array.from(e.keys) as string[],
        });

        setFlowsheet(updatedFlowsheet);
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
      const firstPlacement = JSON.parse(items[0].placement) as Placement;
      const displayName =
        firstPlacement.type === 'COURSE'
          ? `${flowsheet.courses[firstPlacement.course].code}: ${flowsheet.courses[firstPlacement.course].name}`
          : 'Elective slot';

      return (
        <div className={styles.dragPreview}>
          {displayName} <span className={styles.dragPreviewItemCount}>{items.length}</span>
        </div>
      );
    },
  });

  return (
    <div className={styles.term}>
      <Box px={1}>
        <Group justify="center">
          <Text tone="dimmed" weight="medium" size="xs">
            Term {term.index}
          </Text>
        </Group>
      </Box>

      <ListBox
        items={term.placements}
        selectionMode="multiple"
        selectedKeys={selectedPlacements}
        dragAndDropHooks={dragAndDropHooks}
        aria-label={`Term ${term.index}`}
        className={styles.listBox}
        renderEmptyState={({ isDropTarget }) => (
          <div className={clsx(styles.emptyListBoxState, isDropTarget ? styles.isDropTarget : '')}>
            <CopyPlus size={14} />

            <p>Drop courses here</p>
          </div>
        )}
      >
        {(placement) => {
          switch (placement.type) {
            case 'COURSE': {
              const course = flowsheet.courses[placement.course];

              return (
                <ListBoxItem
                  id={placement.id}
                  textValue={course.name}
                  className={styles.listBoxItem}
                >
                  <CoursePlacement course={course} placement={placement} />
                </ListBoxItem>
              );
            }

            // case 'ELECTIVE_SLOT': {
            //   const slot = flowsheet.sections
            //     .flatMap((s) => s.courses.includes(placement.electiveSlot) ? [s] : [])
            //     .at(0);
            //
            //   return (
            //     <ListBoxItem id={placement.id} textValue="Elective Slot" className={styles.listBoxItem}>
            //       <><ElectiveSlotCard slot={slot} /></>
            //     </ListBoxItem>
            //   );
            // }

            default:
              return null;
          }
        }}
      </ListBox>

      <AddCoursePlacement termIndex={term.index} />
    </div>
  );
}
