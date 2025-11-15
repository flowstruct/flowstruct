import React, { useContext } from 'react';
import type { Course } from '../domain/course.ts';
import { useLocalStorage } from './local-storage.hook.ts';

type CoursesContextValues = {
  courses: Course[];
  setCourses: (newValue: Course[] | ((prev: Course[]) => Course[])) => void;
};

const CoursesContext = React.createContext<CoursesContextValues | undefined>(undefined);

const STORAGE_KEY = 'courses';

type CoursesProviderProps = {
  children: React.ReactNode;
};

export function CoursesProvider({ children }: CoursesProviderProps) {
  const [courses, setCourses] = useLocalStorage<Course[]>(STORAGE_KEY, []);

  return (
    <CoursesContext.Provider value={{ courses, setCourses }}>{children}</CoursesContext.Provider>
  );
}

export const useCourses = () => {
  const context = useContext(CoursesContext);

  if (!context) throw new Error('useFlowsheet must be used within FlowsheetProvider.');

  return context;
};
