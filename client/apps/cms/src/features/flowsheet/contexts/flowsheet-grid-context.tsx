import React, { useContext } from 'react';

type FlowsheetGridContextValues = {
  selectedCourses: Set<number>;
  toggleSelectCourse: (courseId: number) => void;
  isSelected: (courseId: number) => boolean;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

type FlowsheetGridProviderProps = {
  children: React.ReactNode;
};

export function FlowsheetGridProvider({ children }: FlowsheetGridProviderProps) {
  const [selectedCourses, setSelectedCourses] = React.useState<Set<number>>(new Set());

  const toggleSelectCourse = (courseId: number) => {
    setSelectedCourses((prev) => {
      const updated = new Set(prev);

      if (updated.has(courseId)) {
        updated.delete(courseId);
      } else {
        updated.add(courseId);
      }

      return updated;
    });
  };

  const isSelected = (courseId: number) => selectedCourses.has(courseId);

  return (
    <FlowsheetGridContext.Provider value={{ selectedCourses, toggleSelectCourse, isSelected }}>
      {children}
    </FlowsheetGridContext.Provider>
  );
}

export const useFlowsheetGridContext = () => {
  const context = useContext(FlowsheetGridContext);

  if (!context) {
    throw new Error('useFlowsheetGridContext must be used within FlowsheetGridProvider.');
  }

  return context;
};
