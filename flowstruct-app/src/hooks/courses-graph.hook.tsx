import React from 'react';
import { buildCoursesGraph, type Requisites } from '../domain/courses-graph.ts';
import { useCourses } from './courses.hook.tsx';

type CoursesGraphContextType = {
  coursesGraph: Map<string, Requisites>;
};

const CoursesGraphContext = React.createContext<CoursesGraphContextType | undefined>(undefined);

export function CoursesGraphProvider({ children }: { children: React.ReactNode }) {
  const { courses } = useCourses();

  const coursesGraph = React.useMemo(() => buildCoursesGraph(courses), [courses]);

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
