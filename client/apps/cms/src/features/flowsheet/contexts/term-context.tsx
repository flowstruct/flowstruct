import { CourseSummary } from '@/features/course/domain/course';
import { Term } from '@/features/flowsheet/domain/flowsheet';
import clsx from 'clsx';
import React from 'react';
import {
  DragAndDropHooks,
  DropIndicator,
  isTextDropItem,
  useDragAndDrop,
} from 'react-aria-components';
import { useListData } from 'react-stately';
import styles from './term-context.module.css';

type TermContextValues = {
  term: Term;
  dragAndDropHooks: DragAndDropHooks<CourseSummary>;
};

const TermContext = React.createContext<TermContextValues | undefined>(undefined);

type TermProviderProps = {
  term: Term;
  children: React.ReactNode;
};

export function TermProvider({ term, children }: TermProviderProps) {
  const list = useListData({
    initialItems: term.placements,
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

  return <TermContext.Provider value={{ term, dragAndDropHooks }}>{children}</TermContext.Provider>;
}

export const useTermContext = () => {
  const context = React.useContext(TermContext);

  if (!context) {
    throw new Error('useTermContext must be used within TermProvider.');
  }

  return context;
};
