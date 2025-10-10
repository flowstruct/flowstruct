import React, { useContext } from 'react';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { courseKeys } from '@/features/course/queries.ts';
import { CoursesPage, CourseSummary } from '@/features/course/domain/course.ts';

type CourseCatalogContextValue = {
  courseCatalog: Map<number, CourseSummary>;
};

const CourseCatalogContext = React.createContext<CourseCatalogContextValue | undefined>(undefined);

type CourseCatalogProviderProps = { children: React.ReactNode };

export function CourseCatalogProvider({ children }: CourseCatalogProviderProps) {
  const queryClient = useQueryClient();

  const courseCatalog = React.useMemo(() => {
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
    <CourseCatalogContext.Provider value={{ courseCatalog }}>
      {children}
    </CourseCatalogContext.Provider>
  );
}

export const useCourseCatalogContext = () => {
  const context = useContext(CourseCatalogContext);

  if (!context)
    throw new Error('useCourseCatalogContext must be used within CourseCatalogProvider.');

  return context;
};
