import { DropIndicator, ListBox, ListBoxItem, useDragAndDrop } from 'react-aria-components';
import { isTextDropItem } from 'react-aria';
import styles from './term.module.css';
import clsx from 'clsx';
import type { Placement, Term } from '../../domain/flowsheet.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { Box } from '../layout/box.tsx';
import { Text } from '../layout/text.tsx';
import { CourseCard } from './course-card.tsx';
import { AddCourseCard } from './add-course-card.tsx';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import {
  appendPlacements,
  insertPlacements,
  removePlacements,
  reorderPlacements,
} from '../../domain/placement.ts';
import type { Course } from '../../domain/course.ts';

type TermProps = {
  term: Term;
};

export function Term({ term }: TermProps) {
  const { flowsheet, setFlowsheet } = useFlowsheet();
  const { selectedCourses } = useFlowsheetGrid();

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

      const updatedFlowsheet = insertPlacements({
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

      const updatedFlowsheet = appendPlacements({
        flowsheet,
        termIndex: term.index,
        placements: processedItems,
      });

      setFlowsheet(updatedFlowsheet);
    },

    onReorder(e) {
      const updatedFlowsheet = reorderPlacements({
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
        const updatedFlowsheet = removePlacements({
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
      const firstItem = JSON.parse(items[0].placement) as Course;

      return (
        <div className={styles.dragPreview}>
          {firstItem.code}: {firstItem.name}{' '}
          <span className={styles.dragPreviewItemCount}>{items.length}</span>
        </div>
      );
    },
  });

  return (
    <div className={styles.term}>
      <Box px={1}>
        <Text tone="dimmed" weight="medium" size="xs">
          Term {term.index}
        </Text>
      </Box>

      <ListBox
        items={term.placements}
        selectionMode="multiple"
        selectedKeys={selectedCourses}
        dragAndDropHooks={dragAndDropHooks}
        aria-label={`Term ${term.index}`}
        className={styles.listBox}
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
                  <CourseCard course={course} />
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

      <AddCourseCard termIndex={term.index} />
    </div>
  );
}
