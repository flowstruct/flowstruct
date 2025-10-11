import { Placement, Term } from '@/features/flowsheet/domain/flowsheet.ts';
import React, { useContext } from 'react';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { getFlowsheetTerms } from '@/features/flowsheet/domain/getFlowsheetTerms.ts';

type FlowsheetGridContextValues = {
  terms: Record<Term, Placement[]>;
  pendingCourses: Map<number, Term>;
  pendCoursesFromCatalog: ({ term, courseIds }: { term: Term; courseIds: number[] }) => void;
  unpendCourseFromGrid: (courseId: number) => void;
  unpendAllCoursesFromTerm: (term: Term) => void;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

type FlowsheetGridProviderProps = { children: React.ReactNode };

export function FlowsheetGridProvider({ children }: FlowsheetGridProviderProps) {
  const [pendingCourses, setPendingCourses] = React.useState<Map<number, Term>>(new Map());
  const { flowsheet } = useFlowsheetContext();

  const pendCoursesFromCatalog = ({ term, courseIds }: { term: Term; courseIds: number[] }) => {
    setPendingCourses((prev) => {
      const updated = new Map(prev);

      Array.from(updated.entries()).forEach(([k, v]) => {
        if (v === term && !courseIds.includes(k)) {
          updated.delete(k);
        }
      });

      courseIds.forEach((courseId) => {
        updated.set(courseId, term);
      });

      return updated;
    });
  };

  const unpendCourseFromGrid = (courseId: number) => {
    setPendingCourses((prev) => {
      const updated = new Map(prev);
      updated.delete(courseId);

      return updated;
    });
  };

  const unpendAllCoursesFromTerm = (term: Term) => {
    setPendingCourses((prev) => {
      const updated = new Map(prev);
      updated.forEach((v, k) => {
        if (v === term) updated.delete(k);
      });

      return updated;
    });
  };

  const terms = React.useMemo(() => getFlowsheetTerms(flowsheet), [flowsheet.placements]);

  const contextValue = { terms, pendingCourses, pendCoursesFromCatalog, unpendCourseFromGrid, unpendAllCoursesFromTerm };

  return (
    <FlowsheetGridContext.Provider value={contextValue}>{children}</FlowsheetGridContext.Provider>
  );
}

export const useFlowsheetGridContext = () => {
  const context = useContext(FlowsheetGridContext);

  if (!context)
    throw new Error('useFlowsheetGridContext must be used within FlowsheetGridProvider.');

  return context;
};
