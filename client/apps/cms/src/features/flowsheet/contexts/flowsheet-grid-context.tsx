import { Placement, Term } from '@/features/flowsheet/domain/flowsheet.ts';
import React, { useContext } from 'react';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';

type FlowsheetGridContextValues = {
  terms: Record<Term, Placement[]>;
  pendingCourses: Map<number, Term>;
  pendCoursesFromCatalog: ({ term, courseIds }: { term: Term; courseIds: number[] }) => void;
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

  const terms = React.useMemo(() => {
    const grouped = Object.groupBy(flowsheet.placements, (p) => p.term);
    if (Object.keys(grouped).length === 0) {
      return { 1: [] } as Record<Term, Placement[]>;
    }
    return grouped as Record<Term, Placement[]>;
  }, [flowsheet.placements]);

  return (
    <FlowsheetGridContext.Provider value={{ terms, pendingCourses, pendCoursesFromCatalog }}>
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