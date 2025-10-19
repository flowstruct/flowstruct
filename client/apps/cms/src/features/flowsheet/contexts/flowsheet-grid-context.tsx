import React, { useContext } from 'react';
import { Placement } from '@/features/flowsheet/domain/flowsheet.ts';
import { getFlowsheetTerms } from '@/features/flowsheet/domain/getFlowsheetTerms';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';

type FlowsheetGridContextValues = {
  selectedCourses: Set<number>;
  toggleSelectCourse: (courseId: number) => void;
  isSelectedCourse: (courseId: number) => boolean;
  clearSelectedCourses: () => void;
  onCourseSelectionChange: (selection: Set<number>) => void;
  terms: Record<number, Placement[]>;
  createTerm: () => void;
  validateTerms: (courseId: number) => void;
  validTerms: number[] | null;
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
  const [allPossibleTermsCount, setAllPossibleTermsCount] = React.useState<number>(
    Math.max(...Object.keys(getFlowsheetTerms(flowsheet)).map(Number))
  );

  const [validTerms, setValidTerms] = React.useState<number[] | null>(null);

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

  const onCourseSelectionChange = (selection: Set<number>) => {
    setSelectedCourses(selection);
  };

  const validateTerms = (courseId: number) => {
    console.log(courseId);
    setValidTerms([1, 2, 3]);
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
        onCourseSelectionChange,
        terms,
        validateTerms,
        validTerms,
        createTerm,
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
