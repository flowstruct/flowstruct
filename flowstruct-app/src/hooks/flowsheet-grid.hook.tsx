import React, { useContext } from 'react';

type FlowsheetGridContextValues = {
  selectedCourses: Set<string>;
  toggleSelectCourse: (courseId: string) => void;
  isSelectedCourse: (courseId: string) => boolean;
  clearSelectedCourses: () => void;
  onCourseSelectionChange: (selection: Set<string>) => void;
  validateTerms: (courseId: string) => void;
  validTerms: Set<number>;
  focusedCourse: string | null;
  toggleFocusCourse: (courseId: string) => void;
  isFocusedCourse: (courseId: string) => boolean;
  clearFocusedCourse: () => void;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

type FlowsheetGridProviderProps = {
  children: React.ReactNode;
};

export function FlowsheetGridProvider({ children }: FlowsheetGridProviderProps) {
  const [focusedCourse, setFocusedCourse] = React.useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = React.useState<Set<string>>(new Set());
  const [validTerms, setValidTerms] = React.useState<Set<number>>(new Set());

  const toggleFocusCourse = (courseId: string) => {
    if (courseId === focusedCourse) {
      setFocusedCourse(null);
      return;
    }

    setFocusedCourse(courseId);
  };

  const isFocusedCourse = (courseId: string) => courseId === focusedCourse;

  const clearFocusedCourse = () => setFocusedCourse(null);

  const toggleSelectCourse = (courseId: string) => {
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

  const onCourseSelectionChange = (selection: Set<string>) => {
    setSelectedCourses(selection);
  };

  const validateTerms = (courseId: string) => {
    console.log(courseId);
    setValidTerms(new Set());
  };

  const clearSelectedCourses = () => setSelectedCourses(new Set());

  const isSelectedCourse = (courseId: string) => selectedCourses.has(courseId);

  return (
    <FlowsheetGridContext.Provider
      value={{
        selectedCourses,
        toggleSelectCourse,
        isSelectedCourse,
        clearSelectedCourses,
        onCourseSelectionChange,
        validateTerms,
        validTerms,
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

export const useFlowsheetGrid = () => {
  const context = useContext(FlowsheetGridContext);

  if (!context) throw new Error('useFlowsheetGrid must be used within FlowsheetGridProvider.');

  return context;
};
