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
import { Link, Scaling, SquarePen, TagIcon, Trash } from 'lucide-react';
import { useFocusRing, usePress } from 'react-aria';
import styles from './course-card.module.css';
import { useSortable } from '@dnd-kit/react/sortable';
import { useTermContext } from '@/features/flowsheet/contexts/term-context';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import React from 'react';
import { mergeRefs } from '@/shared/utils/mergeRefs';

type CourseCardProps = {
  course: CourseSummary;
  placement: Placement;
};

export function CourseCard({ course, placement, ...props }: CourseCardProps) {
  const { flowsheet } = useFlowsheetContext();
  const { state, dispatch } = useFlowsheetGridContext();
  const { term } = useTermContext();
  const placementState = usePlacement(placement);
  const { ref: sortableRef, isDragging } = useSortable({
    id: course.id,
    index: placement.position - 1,
    type: 'placement',
    accept: 'placement',
    group: term.id,
  });
  const optionsTriggerRef = React.useRef(null);
  const [optionsIsOpen, setOptionsOpen] = React.useState(false);

  const linkPrerequisite = useMutation({
    mutationFn: () =>
      flowsheetApi.linkPrerequisites({
        flowsheetId: flowsheet.id,
        courseId: state.linkSource as number,
        prerequisiteIds: [course.id],
      }),
  });

  const unlinkPrerequisite = useMutation({
    mutationFn: () =>
      flowsheetApi.unlinkPrerequisites({
        flowsheetId: flowsheet.id,
        courseId: state.linkSource as number,
        prerequisiteIds: [course.id],
      }),
  });

  const linkCorequisite = useMutation({
    mutationFn: () =>
      flowsheetApi.linkCorequisites({
        flowsheetId: flowsheet.id,
        courseId: state.linkSource as number,
        corequisiteIds: [course.id],
      }),
  });

  const unlinkCorequisite = useMutation({
    mutationFn: () =>
      flowsheetApi.unlinkCorequisites({
        flowsheetId: flowsheet.id,
        courseId: state.linkSource as number,
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
        dispatch({ type: 'TOGGLE_SELECT_MODE', payload: { courseId: course.id } });
        return;
      }

      if (placementState === 'SELECTABLE') {
        dispatch({ type: 'TOGGLE_SELECT_MODE', payload: { courseId: course.id } });
        return;
      }

      if (placementState === 'SELECTED') {
        dispatch({ type: 'TOGGLE_SELECT_MODE', payload: { courseId: course.id } });
        return;
      }

      if (placementState === 'PREREQ_LINK') {
        unlinkPrerequisite.mutate();
        return;
      }

      if (placementState === 'AVAILABLE_LINK' && state.linkType === 'PREREQ') {
        linkPrerequisite.mutate();
        return;
      }

      if (placementState === 'COREQ_LINK') {
        unlinkCorequisite.mutate();
        return;
      }

      if (placementState === 'AVAILABLE_LINK' && state.linkType === 'COREQ') {
        linkCorequisite.mutate();
        return;
      }

      if (placementState === 'LINK_SOURCE') {
        dispatch({ type: 'TOGGLE_LINK_MODE', payload: { courseId: course.id, type: null } });
        return;
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
        data-dragging={isDragging}
        data-state={placementState}
        role="button"
        tabIndex={0}
        ref={mergeRefs(sortableRef as React.Ref<HTMLDivElement>, optionsTriggerRef)}
      >
        <Stack fill gap={1}>
          <Group justify="between">
            <h3 className={styles.code}>{course.code}</h3>

            {showCheckbox && (
              <Checkbox
                onChange={() =>
                  dispatch({ type: 'TOGGLE_SELECT_MODE', payload: { courseId: course.id } })
                }
                isSelected={state.selected.has(course.id)}
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
                  type: 'TOGGLE_LINK_MODE',
                  payload: { courseId: course.id, type: 'PREREQ' },
                });
                setOptionsOpen(false);
              }}
            >
              <SquarePen size={14} /> Pre-requisites
            </Button>

            <Button
              size="sm"
              variant="transparent"
              onPress={() => {
                dispatch({
                  type: 'TOGGLE_LINK_MODE',
                  payload: { courseId: course.id, type: 'COREQ' },
                });
                setOptionsOpen(false);
              }}
            >
              <SquarePen size={14} /> Co-requisites
            </Button>

            <Divider orientation="vertical" />

            <TooltipTrigger>
              <Button size="sm" shape="icon" variant="transparent">
                <TagIcon size={14} />
              </Button>

              <Tooltip>Assign section</Tooltip>
            </TooltipTrigger>

            <TooltipTrigger>
              <Button size="sm" shape="icon" variant="transparent">
                <Scaling size={14} />
              </Button>

              <Tooltip>Resize</Tooltip>
            </TooltipTrigger>

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
