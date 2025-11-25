import clsx from 'clsx';
import { CopyPlus, Grid2X2Plus, Plus } from 'lucide-react';
import { isTextDropItem, useKeyboard } from 'react-aria';
import { DropIndicator, GridList, GridListItem, useDragAndDrop } from 'react-aria-components';
import { createPortal } from 'react-dom';
import type { Course } from '../../domain/course';
import type { Placement, Term } from '../../domain/flowsheet';
import { appendToTerm, reorderPlacements } from '../../domain/placement.ts';
import { useCourses } from '../../hooks/courses.hook';
import { useDisclosure } from '../../hooks/disclosure.hook';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook';
import { useForm } from '../../hooks/form.hook';
import { usePlacements } from '../../hooks/placements.hook';
import { useTerms } from '../../hooks/terms.hook';
import { handleSubmit } from '../../utils/handle-submit';
import { Box } from '../layout/box';
import Group from '../layout/group';
import { Text } from '../layout/text.tsx';
import { Button } from '../ui/Button';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip';
import { UnstyledButton } from '../ui/UnstyledButton';
import { CoursePlacementForm } from './course-placement/course-placement-form.tsx';
import { CoursePlacement } from './course-placement/course-placement.tsx';
import styles from './flowsheet-grid.module.css';
import { MultiSelectToolbar } from './multi-select-toolbar.tsx';

export function FlowsheetGrid() {
  const { clearSelectedPlacements, clearFocusedPlacement, clearLinkingMode } = useFlowsheetGrid();
  const { terms, setTerms } = useTerms();
  const { placements } = usePlacements();

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        clearSelectedPlacements();
        clearFocusedPlacement();
        clearLinkingMode();
      }
    },
  });

  const createTerm = () => {
    setTerms((terms) => [...terms, { id: crypto.randomUUID(), name: 'Untitled term' }]);
  };

  return (
    <>
      <Box overflow="auto" overflowY="hidden" {...keyboardProps}>
        <Group align="start">
          {terms.map((t) => (
            <Term
              key={t.id}
              term={t}
              placements={Object.values(placements)
                .filter((p) => p.term === t.id)
                .sort((p1, p2) => p1.position - p2.position)}
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
      </Box>

      {createPortal(<MultiSelectToolbar />, document.body)}
    </>
  );
}

type TermProps = {
  term: Term;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { courses } = useCourses();
  const { placements: allPlacements, setPlacements } = usePlacements();

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
      if (e.target.dropPosition === 'on') return;

      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) => JSON.parse(await item.getText('placement')))
      );

      const sourceId = processedItems[0].id;
      const targetId = e.target.key as string;

      console.log(e.target.dropPosition);
      const reorderedPlacements = reorderPlacements(
        sourceId,
        targetId,
        e.target.dropPosition,
        allPlacements
      );

      setPlacements(reorderedPlacements);
    },

    async onRootDrop(e) {
      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) => JSON.parse(await item.getText('placement')))
      );

      const sourceId = processedItems[0];

      const reorderedPlacements = appendToTerm(sourceId, term.id, allPlacements);

      setPlacements(reorderedPlacements);
    },

    onReorder(e) {
      const sourceId = Array.from(e.keys)[0] as string;
      const targetId = e.target.key as string;

      if (e.target.dropPosition === 'on') return;

      const reorderedPlacements = reorderPlacements(
        sourceId,
        targetId,
        e.target.dropPosition,
        allPlacements
      );

      setPlacements(reorderedPlacements);
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
          ? `${courses[firstPlacement.item].code}: ${courses[firstPlacement.item].name}`
          : 'Elective slot';
      return (
        <div className={styles.dragPreview}>
          {displayName} <span className={styles.dragPreviewItemCount}>{items.length}</span>
        </div>
      );
    },
  });

  return (
    <div key={term.id} className={styles.term}>
      <Box px={1}>
        <Group justify="center">
          <Text tone="dimmed" weight="medium" size="xs">
            {term.name}
          </Text>
        </Group>
      </Box>

      <GridList
        items={placements}
        selectionMode="single"
        aria-label={term.name}
        dragAndDropHooks={dragAndDropHooks}
        dependencies={[courses]}
        renderEmptyState={({ isDropTarget }) => {
          if (Object.keys(courses).length === 0) return;

          return (
            <div
              className={clsx(styles.emptyGridListState, isDropTarget ? styles.isDropTarget : '')}
            >
              <CopyPlus size={14} />

              <p>Drop courses here</p>
            </div>
          );
        }}
        className={styles.gridList}
      >
        {(placement) => {
          if (placement.type === 'COURSE') {
            const course = courses[placement.item];

            return (
              <GridListItem
                id={placement.id}
                key={placement.id}
                textValue={course.name}
                className={styles.gridListItem}
              >
                <CoursePlacement course={course} placement={placement} />
              </GridListItem>
            );
          }
          return null;
        }}
      </GridList>

      <AddCoursePlacement term={term} />
    </div>
  );
}

type AddCourseCardProps = {
  term: Term;
};

function AddCoursePlacement({ term }: AddCourseCardProps) {
  const { setCourses } = useCourses();
  const { placements, setPlacements } = usePlacements();

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
  const form = useForm(addCourseData);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const formEl = e.currentTarget.querySelector('form');
        if (formEl) formEl.requestSubmit();
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

    const newPlacement: Placement = {
      id: crypto.randomUUID(),
      type: 'COURSE',
      item: course.id,
      span: 1,
      term: term.id,
      position: 0,
    };

    const reorderedPlacements = appendToTerm(newPlacement, term.id, placements);

    setPlacements(reorderedPlacements);

    setCourses((courses) => ({
      ...courses,
      [course.id]: course,
    }));

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
  console.log(insertPos);
}
