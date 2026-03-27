import { CourseSummary } from '@/features/course/domain/course';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { Placement } from '@/features/flowsheet/domain/flowsheet';
import { usePlacement } from '@/features/flowsheet/hooks/use-placement';
import { Box } from '@/shared/components/layout/box';
import Group from '@/shared/components/layout/group';
import { Stack } from '@/shared/components/layout/stack';
import { Text } from '@/shared/components/layout/text';
import { Button } from '@/shared/components/ui/Button';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Divider } from '@/shared/components/ui/divider';
import { Popover } from '@/shared/components/ui/Popover';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip';
import { Link, SquarePen, Trash } from 'lucide-react';
import { useFocusRing, usePress } from 'react-aria';
import styles from './course-card.module.css';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import React from 'react';
import { usePlacementMoveContext } from '@/features/flowsheet/contexts/placement-move-context';

type CourseCardProps = {
  course: CourseSummary;
  placement: Placement;
};

export function CourseCard({ course, placement, ...props }: CourseCardProps) {
  const { flowsheet } = useFlowsheetContext();
  const { state, dispatch } = useFlowsheetGridContext();
  const { dragHandlers } = usePlacementMoveContext();
  const placementState = usePlacement(placement);
  const optionsTriggerRef = React.useRef(null);
  const [optionsIsOpen, setOptionsOpen] = React.useState(false);

  const linkPrerequisite = useMutation({
    mutationFn: (courseId: number) =>
      flowsheetApi.linkPrerequisites({
        flowsheetId: flowsheet.id,
        courseId,
        prerequisiteIds: [course.id],
      }),
  });

  const unlinkPrerequisite = useMutation({
    mutationFn: (courseId: number) =>
      flowsheetApi.unlinkPrerequisites({
        flowsheetId: flowsheet.id,
        courseId,
        prerequisiteIds: [course.id],
      }),
  });

  const linkCorequisite = useMutation({
    mutationFn: (courseId: number) =>
      flowsheetApi.linkCorequisites({
        flowsheetId: flowsheet.id,
        courseId,
        corequisiteIds: [course.id],
      }),
  });

  const unlinkCorequisite = useMutation({
    mutationFn: (courseId: number) =>
      flowsheetApi.unlinkCorequisites({
        flowsheetId: flowsheet.id,
        courseId,
        corequisiteIds: [course.id],
      }),
  });

  const removeCourse = useMutation({
    mutationFn: () =>
      flowsheetApi.removeCourses({ flowsheetId: flowsheet.id, courseIds: [course.id] }),
  });

  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if ((e.ctrlKey || e.shiftKey) && placementState === 'NORMAL') {
        dispatch({ type: 'SELECT', courseId: course.id });
        return;
      }

      if (placementState === 'SELECTABLE') {
        dispatch({ type: 'SELECT', courseId: course.id });
        return;
      }

      if (placementState === 'SELECTED') {
        dispatch({ type: 'SELECT', courseId: course.id });
        return;
      }

      if (state.current === 'LINK') {
        if (placementState === 'PREREQ_LINK') {
          unlinkPrerequisite.mutate(state.courseId);
          return;
        }

        if (placementState === 'AVAILABLE_LINK' && state.type === 'PREREQ') {
          linkPrerequisite.mutate(state.courseId);
          return;
        }

        if (placementState === 'COREQ_LINK') {
          unlinkCorequisite.mutate(state.courseId);
          return;
        }

        if (placementState === 'AVAILABLE_LINK' && state.type === 'COREQ') {
          linkCorequisite.mutate(state.courseId);
          return;
        }

        if (placementState === 'LINK_SOURCE') {
          dispatch({ type: 'STOP' });
          return;
        }
      }

      setOptionsOpen(true);
    },
  });
  const { focusProps, isFocusVisible } = useFocusRing(props);

  const showCheckbox =
    placementState === 'NORMAL' || placementState === 'SELECTED' || placementState === 'SELECTABLE';

  return (
    <>
      <div
        {...pressProps}
        {...focusProps}
        className={styles.card}
        data-focus-visible={isFocusVisible || undefined}
        data-pressed={isPressed || undefined}
        data-state={placementState}
        role="button"
        tabIndex={0}
        ref={optionsTriggerRef}
        draggable
        onDragStart={(e) => dragHandlers.onDragStart(e, course.id)}
        onDragEnd={dragHandlers.onDragEnd}
        onContextMenu={(e) => {
          e.preventDefault();
          setOptionsOpen(true);
        }}
      >
        <Stack fill gap={1}>
          <Group justify="between">
            <h3 className={styles.code}>{course.code}</h3>

            {showCheckbox && (
              <Checkbox
                onChange={() => dispatch({ type: 'SELECT', courseId: course.id })}
                isSelected={state.current === 'SELECT' && state.courseIds.has(course.id)}
              />
            )}

            {placementState === 'PREREQ_LINK' && <Link size={13} />}
            {placementState === 'COREQ_LINK' && <Link size={13} />}
          </Group>

          <Text size="xs">{course.name}</Text>
        </Stack>
      </div>

      <Popover
        placement="top"
        isOpen={optionsIsOpen}
        onOpenChange={setOptionsOpen}
        triggerRef={optionsTriggerRef}
      >
        <Box px={1} py={1}>
          <Group gap={1}>
            <Button
              size="sm"
              variant="transparent"
              onPress={() => {
                dispatch({
                  type: 'LINK',
                  courseId: course.id,
                  linkType: 'PREREQ',
                });
                setOptionsOpen(false);
              }}
            >
              <SquarePen size={14} /> Prerequisites
            </Button>

            <Button
              size="sm"
              variant="transparent"
              onPress={() => {
                dispatch({
                  type: 'LINK',
                  courseId: course.id,
                  linkType: 'COREQ',
                });
                setOptionsOpen(false);
              }}
            >
              <SquarePen size={14} /> Corequisites
            </Button>

            <Divider orientation="vertical" />

            <TooltipTrigger>
              <Button
                size="sm"
                shape="icon"
                variant="transparent"
                onPress={() => removeCourse.mutate()}
                isPending={removeCourse.isPending}
              >
                <Trash color="red" size={14} />
              </Button>

              <Tooltip>Remove</Tooltip>
            </TooltipTrigger>
          </Group>
        </Box>
      </Popover>
    </>
  );
}
