import { flowsheetApi } from '@/features/flowsheet/api';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { DragEvent, ReactNode, useCallback, useMemo } from 'react';
import classes from '@/features/flowsheet/components/flowsheet-grid/flowsheet-grid.module.css';
import { computeAllowedTerms } from '@/features/flowsheet/domain/computeAllowedTerms';
import { useFlowsheetCoursesGraphContext } from '@/features/flowsheet/contexts/courses-graph-context';
import { flowsheetKeys } from '@/features/flowsheet/queries';
import { Flowsheet } from '@/features/flowsheet/domain/flowsheet';

type DragHandlers = {
  onDragStart: (e: DragEvent<HTMLDivElement>, courseId: number) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
};

type PlacementMoveContextType = {
  dragHandlers: DragHandlers;
  isDisabled: (courseId: number) => boolean;
  allowedTerms: Set<number>;
};

const PlacementMoveContext = React.createContext<PlacementMoveContextType | undefined>(undefined);

function PlacementMoveProvider({ children }: { children: ReactNode }) {
  const { flowsheet } = useFlowsheetContext();
  const { state, dispatch } = useFlowsheetGridContext();
  const { coursesGraph } = useFlowsheetCoursesGraphContext();
  const queryClient = useQueryClient();

  const moveCourse = useMutation({
    mutationFn: flowsheetApi.moveCourse,
    onMutate: async ({ courseId, term: targetTermNumber, position }) => {
      const queryKey = flowsheetKeys.detail(flowsheet.id);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Flowsheet>(queryKey);
      if (!previous) return;

      queryClient.setQueryData<Flowsheet>(queryKey, (old) => {
        if (!old) return old;

        const updated = structuredClone(old);
        let movedSpan = 1;

        for (const term of updated.terms) {
          const index = term.placements.findIndex((p) => p.course === courseId);
          if (index !== -1) {
            movedSpan = term.placements[index].span;
            term.placements.splice(index, 1);
            term.placements.forEach((p, i) => (p.position = i + 1));
            break;
          }
        }

        const targetTerm = updated.terms.find((t) => t.termNumber === targetTermNumber);
        if (!targetTerm) return old;

        targetTerm.placements.splice(position - 1, 0, {
          course: courseId,
          position,
          span: movedSpan,
        });

        targetTerm.placements.forEach((p, i) => (p.position = i + 1));

        return updated;
      });
    },
  });

  const allowedTerms = React.useMemo(() => {
    if (!state.moving) return new Set<number>();

    return computeAllowedTerms(
      state.moving,
      coursesGraph,
      flowsheet.termAndPlacementByCourse,
      flowsheet.terms
    );
  }, [state.moving, coursesGraph, flowsheet]);

  const isDisabled = (courseId: number) => {
    const termAndPlacement = flowsheet.termAndPlacementByCourse[courseId];
    const term = termAndPlacement.term;

    if (!termAndPlacement) return true;
    if (!allowedTerms.has(term.id)) return true;

    return false;
  };

  const clearAllIndicators = useCallback(() => {
    const indicators = document.querySelectorAll(`.${classes.dropIndicator}`);
    indicators.forEach((indicator) => {
      (indicator as HTMLElement).style.opacity = '0';
    });
  }, []);

  const getNearestIndicator = useCallback((e: DragEvent<HTMLDivElement>) => {
    const indicators = document.querySelectorAll(`.${classes.dropIndicator}`);

    let closest: {
      distance: number;
      element: Element | null;
    } = {
      distance: Infinity,
      element: null,
    };

    indicators.forEach((indicator) => {
      const rect = indicator.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      if (distance < closest.distance) {
        closest = {
          distance,
          element: indicator,
        };
      }
    });

    return closest.element as HTMLDivElement | null;
  }, []);

  const dragHandlers: DragHandlers = useMemo(
    () => ({
      onDragStart: (e: DragEvent<HTMLDivElement>, courseId: number) => {
        e.dataTransfer.setData('courseId', String(courseId));
        dispatch({ type: 'MOVE_START', payload: { courseId } });
      },

      onDragEnd: (e: DragEvent<HTMLDivElement>) => {
        clearAllIndicators();

        if (!state.moving) return;

        const nearestIndicator = getNearestIndicator(e);

        if (!nearestIndicator) {
          dispatch({ type: 'MOVE_END' });
          return;
        }

        const isDisabled = JSON.parse(nearestIndicator.dataset.disabled ?? '') as boolean | null;

        if (isDisabled) {
          dispatch({ type: 'MOVE_END' });
          return;
        }

        let targetPosition = JSON.parse(nearestIndicator.dataset.position ?? '') as number | null;
        const targetTerm = JSON.parse(nearestIndicator.dataset.termId ?? '') as number | null;
        const currentTermAndPlacement = flowsheet.termAndPlacementByCourse[state.moving];
        const isSameTerm = currentTermAndPlacement?.term.id === targetTerm;

        if (isSameTerm) {
          const positionDiff = targetPosition - currentTermAndPlacement.placement.position;

          if (positionDiff === 0 || positionDiff === 1) {
            dispatch({ type: 'MOVE_END' });
            return;
          }

          if (positionDiff > 1) {
            targetPosition -= 1;
          }
        }

        if (!targetPosition || !targetTerm) {
          dispatch({ type: 'MOVE_END' });
          return;
        }

        moveCourse.mutate({
          flowsheetId: flowsheet.id,
          courseId: state.moving,
          term: targetTerm,
          position: targetPosition,
        });

        dispatch({ type: 'MOVE_END' });
      },
      onDragOver: (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        clearAllIndicators();

        const nearestIndicator = getNearestIndicator(e);
        if (nearestIndicator) {
          const isDisabled = JSON.parse(nearestIndicator.dataset.disabled ?? '') as boolean | null;

          if (!isDisabled) {
            (nearestIndicator as HTMLElement).style.opacity = '1';
          }
        }
      },

      onDragLeave: (e: DragEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          clearAllIndicators();
        }
      },
    }),
    [moveCourse, clearAllIndicators, getNearestIndicator, state]
  );

  return (
    <PlacementMoveContext.Provider value={{ dragHandlers, isDisabled, allowedTerms }}>
      {children}
    </PlacementMoveContext.Provider>
  );
}

const usePlacementMoveContext = () => {
  const context = React.useContext(PlacementMoveContext);
  if (!context)
    throw new Error('usePlacementMoveContext hook must be used within PlacementMoveProvider.');
  return context;
};

export { usePlacementMoveContext, PlacementMoveContext, PlacementMoveProvider };
