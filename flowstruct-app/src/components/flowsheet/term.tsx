import { useListData } from 'react-stately';
import { DropIndicator, ListBox, ListBoxItem, useDragAndDrop } from 'react-aria-components';
import { isTextDropItem } from 'react-aria';
import styles from './term.module.css';
import clsx from 'clsx';
import type { Course, Term } from '../../types/flowsheet.types';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { Box } from '../layout/box.tsx';
import { Text } from '../layout/text.tsx';
import { CourseCard } from './course-card.tsx';
import { AddCourseCard } from './add-course-card.tsx';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';

type TermProps = {
  term: Term;
};

export function Term({ term }: TermProps) {
  const { flowsheet } = useFlowsheet();
  const { selectedCourses } = useFlowsheetGrid();

  const list = useListData({
    initialItems: term.placements
      .filter((p) => p.type === 'COURSE')
      .map((p) => flowsheet.courses[p.course]),
  });

  const { dragAndDropHooks } = useDragAndDrop<Course>({
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
      const firstItem = JSON.parse(items[0].course) as Course;

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
        items={list.items}
        selectionMode="multiple"
        selectedKeys={selectedCourses}
        dragAndDropHooks={dragAndDropHooks}
        aria-label={`Term ${term}`}
        className={styles.listBox}
      >
        {(item) => (
          <ListBoxItem textValue={item.name} className={styles.listBoxItem}>
            <CourseCard course={item} />
          </ListBoxItem>
        )}
      </ListBox>

      <AddCourseCard term={term.index} />
    </div>
  );
}
