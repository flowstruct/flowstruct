import { Plus } from 'lucide-react';
import React from 'react';
import { ListDropTargetDelegate, ListKeyboardDelegate, useDraggableCollection, useDropIndicator, useDroppableCollection, useKeyboard, type Placement } from 'react-aria';
import { type DropIndicatorProps as AriaDropIndicatorProps } from 'react-aria-components';
import { useDraggableCollectionState, useDroppableCollectionState, useListState, type DraggableCollectionState, type DroppableCollectionState, type ListState } from 'react-stately';
import { addCourse, type Course } from '../../domain/course.ts';
import type { Term } from '../../domain/flowsheet.ts';
import { useDisclosure } from '../../hooks/disclosure.hook.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { useForm } from '../../hooks/form.hook.ts';
import { handleSubmit } from '../../utils/handle-submit.ts';
import { Box } from '../layout/box.tsx';
import Group from '../layout/group.tsx';
import { Text } from '../layout/text.tsx';
import { UnstyledButton } from '../ui/UnstyledButton.tsx';
import { CoursePlacementForm } from './course-placement-form.tsx';
import { CoursePlacement } from './course-placement.tsx';
import styles from './term.module.css';
import clsx from 'clsx';

type TermProps = {
  term: Term;
};

export function Term({ term, ...props }: TermProps) {
  const { flowsheet } = useFlowsheet();

  const ref = React.useRef(null);
  const state = useListState(props);

  const dragState = useDraggableCollectionState<Placement>({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager,
    getItems: (_, items) => {
      return items.map(i => {
        return {
          placement: JSON.stringify(i)
        }
      })
    }
  });
  const dropState = useDroppableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager
  });

  useDraggableCollection(props, dragState, ref);
  const { collectionProps } = useDroppableCollection({
    ...props,
    keyboardDelegate: new ListKeyboardDelegate(
      state.collection,
      state.disabledKeys,
      ref
    ),
    dropTargetDelegate: new ListDropTargetDelegate(state.collection, ref)
  },
    dropState,
    ref
  );

  return (
    <div className={styles.term}>
      <Box px={1}>
        <Group justify="center">
          <Text tone="dimmed" weight="medium" size="xs">
            Term {term.index}
          </Text>
        </Group>
      </Box>

      <div ref={ref} className={styles.placementsList} {...collectionProps}>
        {term.placements.map((placement) => {
          switch (placement.type) {
            case 'COURSE': {
              const course = flowsheet.courses[placement.course];

              return (
                <>
                  <DropIndicator
                    target={{ type: 'item', key: placement.id, dropPosition: 'before' }}
                    dropState={dropState}
                  />

                  <CoursePlacement course={course} dragState={dragState} placement={placement} />

                  {state.collection.getKeyAfter(placement.id) === null && (
                    <DropIndicator
                      target={{ type: 'item', key: placement.id, dropPosition: 'after' }}
                      dropState={dropState}
                    />
                  )}
                </>
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
        })}
      </div>

      <AddCoursePlacement termIndex={term.index} />
    </div>
  );
}

interface DropIndicatorProps extends AriaDropIndicatorProps {
  dropState: DroppableCollectionState;
}

function DropIndicator({ dropState, ...props }: DropIndicatorProps) {
  const ref = React.useRef(null);
  const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(props, dropState, ref);

  if (isHidden) {
    return null;
  }

  return (
    <div
      {...dropIndicatorProps}
      ref={ref}
      className={clsx(styles.dropIndicator, isDropTarget ? styles.dropTarget : '')}
    />
  );
}

type AddCourseCardProps = {
  termIndex: number;
};

function AddCoursePlacement({ termIndex }: AddCourseCardProps) {
  const addCourseData: Course = {
    id: '',
    code: '',
    name: '',
    creditHours: 3,
    ects: 0,
    lectureHours: 0,
    practicalHours: 0,
    type: 'F2F',
    prerequisites: [],
    corequisites: [],
  };

  const disclosure = useDisclosure();
  const { setFlowsheet } = useFlowsheet();
  const form = useForm(addCourseData);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const form = e.currentTarget.querySelector('form');
        if (form) form.requestSubmit();
      }
      if (e.key === 'Escape') {
        disclosure.close();
      }
    },
  });

  const onSubmit = handleSubmit<Course>(() => {
    const course: Course = {
      ...form.data,
      id: crypto.randomUUID(),
      code: form.data.code.toUpperCase(),
    };

    setFlowsheet((flowsheet) => addCourse({ flowsheet, course, termIndex }));

    form.reset();
    disclosure.close();
  });

  return (
    <>
      {!disclosure.isOpen && (
        <UnstyledButton autoFocus className={styles.addCourseButton} onPress={disclosure.open}>
          Add course <Plus size={12} />
        </UnstyledButton>
      )}

      {disclosure.isOpen && (
        <div {...keyboardProps}>
          <CoursePlacementForm onSubmit={onSubmit} form={form} onClose={disclosure.close} />
        </div>
      )}
    </>
  );
}
