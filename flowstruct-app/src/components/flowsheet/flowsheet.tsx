import { Grid2X2Plus, Plus } from 'lucide-react';
import { useKeyboard } from 'react-aria';
import { createPortal } from 'react-dom';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { Box } from '../layout/box.tsx';
import Group from '../layout/group.tsx';
import { Button } from '../ui/Button.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import styles from './flowsheet.module.css';
import { MultiSelectToolbar } from './multi-select-toolbar.tsx';
import { DragDropProvider, useDragDropMonitor, useDroppable } from '@dnd-kit/react';
import { Text } from '../layout/text.tsx';
import { CoursePlacement } from './course-placement.tsx';
import type { Placement, Term } from '../../domain/flowsheet.ts';
import type { Course } from '../../domain/course.ts';
import { useDisclosure } from '../../hooks/disclosure.hook.ts';
import { useForm } from '../../hooks/form.hook.ts';
import { handleSubmit } from '../../utils/handle-submit.ts';
import { UnstyledButton } from '../ui/UnstyledButton.tsx';
import { CoursePlacementForm } from './course-placement-form.tsx';

export function Flowsheet() {
  const { flowsheet, setFlowsheet } = useFlowsheet();
  const { clearFocusedPlacement, clearSelectedPlacements } = useFlowsheetGrid();

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        clearSelectedPlacements();
        clearFocusedPlacement();
      }
    },
  });

  const createTerm = () => {
    setFlowsheet((flowsheet) => ({
      ...flowsheet,
      terms: [...flowsheet.terms, { id: crypto.randomUUID(), name: 'Untitled term' }],
    }));
  };

  return (
    <DragDropProvider
      onDragOver={({ operation }) => {
        if (!operation.target || !operation.source) return;
        if (
          operation.target.type === 'term' &&
          operation.target.id !== operation.source.data.term
        ) {
          console.log('hey');
        }
      }}
    >
      <Box overflow="auto" overflowY="hidden" {...keyboardProps}>
        <Group align="start">
          {flowsheet.terms.map((t) => (
            <Term term={t} placements={flowsheet.placements.filter((p) => p.term === t.id)} />
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
    </DragDropProvider>
  );
}

type AddCourseCardProps = {
  term: Term;
};

type TermProps = {
  term: Term;
  placements: Placement[];
};

function Term({ term, placements }: TermProps) {
  const { flowsheet } = useFlowsheet();
  const { isDropTarget, ref } = useDroppable({ id: term.id, type: 'term' });

  return (
    <div key={term.id} className={styles.term}>
      <Box px={1}>
        <Group justify="center">
          <Text tone="dimmed" weight="medium" size="xs">
            {term.name}
          </Text>
        </Group>
      </Box>

      <div className={styles.placementsList}>
        {placements.map((placement, index) => {
          switch (placement.type) {
            case 'COURSE': {
              const course = flowsheet.courses[placement.course];

              return (
                <CoursePlacement
                  key={placement.id}
                  course={course}
                  placement={placement}
                  index={index}
                />
              );
            }

            default:
              return null;
          }
        })}

        <div
          ref={ref}
          data-is-drop-target={isDropTarget ? true : undefined}
          className={styles.termDropZone}
        />
      </div>

      <AddCoursePlacement term={term} />
    </div>
  );
}

function AddCoursePlacement({ term }: AddCourseCardProps) {
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

    setFlowsheet((flowsheet) => ({
      ...flowsheet,
      courses: { ...flowsheet.courses, [course.id]: course },
      placements: [
        ...flowsheet.placements,
        { id: crypto.randomUUID(), type: 'COURSE', course: course.id, span: 1, term: term.id },
      ],
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
}
