import React from 'react';
import { useFlowsheet } from './flowsheet.hook.tsx';
import { buildCoursesGraph, type Requisites } from '../domain/courses-graph.ts';

type CoursesGraphContextType = {
  coursesGraph: Map<string, Requisites>;
};

const CoursesGraphContext = React.createContext<CoursesGraphContextType | undefined>(undefined);

export function CoursesGraphProvider({ children }: { children: React.ReactNode }) {
  const { flowsheet } = useFlowsheet();

  const coursesGraph = React.useMemo(() => buildCoursesGraph(flowsheet), [flowsheet]);

  return (
    <CoursesGraphContext.Provider value={{ coursesGraph }}>{children}</CoursesGraphContext.Provider>
  );
}

export const useCoursesGraph = () => {
  const context = React.useContext(CoursesGraphContext);

  if (!context) {
    throw new Error('useCoursesGraph must be used within a CoursesGraphProvider');
  }

  return context;
};
