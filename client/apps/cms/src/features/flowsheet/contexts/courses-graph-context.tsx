import React from 'react';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { buildCoursesGraph } from '@/features/flowsheet/domain/buildCoursesGraph';
import type { Requisites } from '@/features/flowsheet/domain/buildCoursesGraph';

type FlowsheetCoursesGraphContextType = {
  coursesGraph: Map<number, Requisites>;
};

const FlowsheetCoursesGraphContext = React.createContext<
  FlowsheetCoursesGraphContextType | undefined
>(undefined);

function FlowsheetCoursesGraphProvider({ children }: { children: React.ReactNode }) {
  const { flowsheet } = useFlowsheetContext();

  const coursesGraph = React.useMemo(() => {
    if (!flowsheet) return new Map<number, Requisites>();
    return buildCoursesGraph(flowsheet);
  }, [flowsheet]);

  return (
    <FlowsheetCoursesGraphContext.Provider value={{ coursesGraph }}>
      {children}
    </FlowsheetCoursesGraphContext.Provider>
  );
}

const useFlowsheetCoursesGraphContext = () => {
  const context = React.useContext(FlowsheetCoursesGraphContext);
  if (!context) {
    throw new Error(
      'useFlowsheetCoursesGraphContext must be used within a FlowsheetCoursesGraphProvider'
    );
  }
  return context;
};

export { FlowsheetCoursesGraphProvider, useFlowsheetCoursesGraphContext };
