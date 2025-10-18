import React, { useContext } from 'react';
import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { getFlowsheetTerms } from '@/features/flowsheet/domain/getFlowsheetTerms';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';

type FlowsheetGridContextValues = {
  selectedCourses: Set<number>;
  toggleSelectCourse: (courseId: number) => void;
  isSelectedCourse: (courseId: number) => boolean;
  clearSelectedCourses: () => void;
  terms: Record<number, Placement[]>;
  createTerm: () => void;
  onDragCourse: (courseId: number) => void;
  draggingCourse: number | null;
  clearDraggingCourse: () => void;
  focusedCourse: number | null;
  toggleFocusCourse: (courseId: number) => void;
  isFocusedCourse: (courseId: number) => boolean;
  clearFocusedCourse: () => void;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

type FlowsheetGridProviderProps = {
  children: React.ReactNode;
};

export function FlowsheetGridProvider({ children }: FlowsheetGridProviderProps) {
  const { flowsheet } = useFlowsheetContext();
  const [focusedCourse, setFocusedCourse] = React.useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = React.useState<Set<number>>(new Set());
  const [draggingCourse, setDraggingCourse] = React.useState<number | null>(null);
  const [allPossibleTermsCount, setAllPossibleTermsCount] = React.useState<number>(
    Math.max(...Object.keys(getFlowsheetTerms(flowsheet)).map(Number))
  );

  const toggleFocusCourse = (courseId: number) => {
    if (courseId === focusedCourse) {
      setFocusedCourse(null);
      return;
    }

    setFocusedCourse(courseId);
  };

  const isFocusedCourse = (courseId: number) => courseId === focusedCourse;

  const clearFocusedCourse = () => setFocusedCourse(null);

  const toggleSelectCourse = (courseId: number) => {
    if (focusedCourse) {
      setFocusedCourse(null);
    }

    setSelectedCourses((prev) => {
      const updated = new Set(prev);

      if (updated.has(courseId)) updated.delete(courseId);
      else updated.add(courseId);

      return updated;
    });
  };

  const onDragCourse = (courseId: number) => {
    setDraggingCourse(courseId);
  };

  const clearDraggingCourse = () => {
    setDraggingCourse(null);
  };

  const clearSelectedCourses = () => setSelectedCourses(new Set());

  const isSelectedCourse = (courseId: number) => selectedCourses.has(courseId);

  const terms = React.useMemo(() => {
    const baseTerms = getFlowsheetTerms(flowsheet);

    for (let i = 1; i <= allPossibleTermsCount; i++) {
      baseTerms[i] = [...(baseTerms[i] ?? [])];
    }

    return baseTerms;
  }, [flowsheet.placements, allPossibleTermsCount]);

  const createTerm = () => setAllPossibleTermsCount((prev) => prev + 1);

  return (
    <FlowsheetGridContext.Provider
      value={{
        selectedCourses,
        toggleSelectCourse,
        isSelectedCourse,
        clearSelectedCourses,
        terms,
        createTerm,
        onDragCourse,
        draggingCourse,
        clearDraggingCourse,
        focusedCourse,
        toggleFocusCourse,
        isFocusedCourse,
        clearFocusedCourse,
      }}
    >
      {children}
    </FlowsheetGridContext.Provider>
  );
}

export const useFlowsheetGridContext = () => {
  const context = useContext(FlowsheetGridContext);
  if (!context)
    throw new Error('useFlowsheetGridContext must be used within FlowsheetGridProvider.');
  return context;
};
