import React, { useContext } from 'react';
import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { getFlowsheetTerms } from '@/features/flowsheet/domain/getFlowsheetTerms';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';

type FlowsheetGridContextValues = {
  selectedCourses: Set<number>;
  toggleSelectCourse: (courseId: number) => void;
  isSelected: (courseId: number) => boolean;
  clearSelectedCourses: () => void;
  terms: Record<number, Placement[]>;
  createTerm: () => void;
  onDragCourse: (courseId: number) => void;
  draggingCourse: number | null;
  clearDraggingCourse: () => void;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

type FlowsheetGridProviderProps = {
  children: React.ReactNode;
};

export function FlowsheetGridProvider({ children }: FlowsheetGridProviderProps) {
  const { flowsheet } = useFlowsheetContext();
  const [selectedCourses, setSelectedCourses] = React.useState<Set<number>>(new Set());
  const [allPossibleTermsCount, setAllPossibleTermsCount] = React.useState<number>(
    Math.max(...Object.keys(getFlowsheetTerms(flowsheet)).map(Number))
  );
  const [draggingCourse, setDragginCourse] = React.useState<number | null>(null);

  const toggleSelectCourse = (courseId: number) => {
    setSelectedCourses((prev) => {
      const updated = new Set(prev);

      if (updated.has(courseId)) updated.delete(courseId);
      else updated.add(courseId);

      return updated;
    });
  };

  const onDragCourse = (courseId: number) => {
    setDragginCourse(courseId);
  };

  const clearDraggingCourse = () => {
    setDragginCourse(null);
  };

  const clearSelectedCourses = () => setSelectedCourses(new Set());

  const isSelected = (courseId: number) => selectedCourses.has(courseId);

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
        isSelected,
        clearSelectedCourses,
        terms,
        createTerm,
        onDragCourse,
        draggingCourse,
        clearDraggingCourse,
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
