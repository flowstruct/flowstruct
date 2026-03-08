import React, { useContext, useMemo, useRef } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useMutation } from '@tanstack/react-query';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { useFlowsheetCoursesGraphContext } from '@/features/flowsheet/contexts/courses-graph-context';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { computeAllowedTerms } from '@/features/flowsheet/domain/computeAllowedTerms';
import { flowsheetApi } from '@/features/flowsheet/api';

type PlacementMoveContextValues = {
  allowedTerms: Set<number>;
};

const PlacementMoveContext = React.createContext<PlacementMoveContextValues | undefined>(undefined);

type PlacementMoveProviderProps = {
  children: React.ReactNode;
};

const EMPTY_SET = new Set<number>();

export function PlacementMoveProvider({ children }: PlacementMoveProviderProps) {
  const { flowsheet } = useFlowsheetContext();
  const { coursesGraph } = useFlowsheetCoursesGraphContext();
  const { state, dispatch } = useFlowsheetGridContext();

  const allowedTerms = useMemo(() => {
    if (!state.moving) return EMPTY_SET;

    return computeAllowedTerms(
      state.moving,
      coursesGraph,
      flowsheet.termAndPlacementByCourse,
      flowsheet.terms
    );
  }, [state.moving, coursesGraph, flowsheet.termAndPlacementByCourse, flowsheet.terms]);

  const allowedTermsRef = useRef(allowedTerms);
  allowedTermsRef.current = allowedTerms;

  const moveCourse = useMutation({
    mutationFn: flowsheetApi.moveCourse,
  });

  return (
    <PlacementMoveContext.Provider value={{ allowedTerms }}>
      <DragDropProvider
        onDragStart={(event) => {
          const { source } = event.operation;

          dispatch({
            type: 'MOVE_START',
            payload: { courseId: source.id as number },
          });
        }}
        onDragOver={(event) => {
          const { source } = event.operation;

          if (isSortable(source) && source.group != null) {
            if (!allowedTermsRef.current.has(source.group as number)) {
              event.preventDefault();
            }
          }
        }}
        onDragEnd={(event) => {
          dispatch({ type: 'MOVE_END' });

          if (event.canceled) return;

          const { source } = event.operation;

          if (isSortable(source)) {
            const { initialIndex, index, initialGroup, group } = source;

            if (initialGroup == null || group == null) return;

            if (initialGroup !== group || initialIndex !== index) {
              moveCourse.mutate({
                flowsheetId: flowsheet.id,
                courseId: source.id as number,
                term: group as number,
                position: index + 1,
              });
            }
          }
        }}
      >
        {children}
      </DragDropProvider>
    </PlacementMoveContext.Provider>
  );
}

export const usePlacementMoveContext = () => {
  const context = useContext(PlacementMoveContext);

  if (!context) {
    throw new Error('usePlacementMoveContext must be used within PlacementMoveProvider.');
  }

  return context;
};
