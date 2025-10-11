import React, { useContext } from 'react';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { courseKeys } from '@/features/course/queries.ts';
import { CoursesPage, CourseSummary } from '@/features/course/domain/course.ts';

type CatalogCoursesContextValue = {
  catalogCourses: Map<number, CourseSummary>;
};

const CatalogCoursesContext = React.createContext<CatalogCoursesContextValue | undefined>(
  undefined
);

type CatalogCoursesProviderProps = { children: React.ReactNode };

export function CatalogCoursesProvider({ children }: CatalogCoursesProviderProps) {
  const queryClient = useQueryClient();

  const catalogCourses = React.useMemo(() => {
    const queries = queryClient.getQueriesData({ queryKey: courseKeys.catalogs() }) as [
      unknown,
      InfiniteData<CoursesPage, number>,
    ][];
    return new Map(
      queries
        .flatMap(([_, data]) => data.pages)
        .flatMap((p) => p.content)
        .map((c) => [c.id, c])
    );
  }, [queryClient.getQueriesData({ queryKey: courseKeys.catalogs() })]);

  return (
    <CatalogCoursesContext.Provider value={{ catalogCourses }}>
      {children}
    </CatalogCoursesContext.Provider>
  );
}

export const useCatalogCoursesContext = () => {
  const context = useContext(CatalogCoursesContext);

  if (!context)
    throw new Error('useCourseCatalogContext must be used within CourseCatalogProvider.');

  return context;
};
