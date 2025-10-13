import React from 'react';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { courseKeys } from '@/features/course/queries.ts';
import { CoursesPage } from '@/features/course/domain/course.ts';

export const useCourseCatalogSearchResults = () => {
  const queryClient = useQueryClient();

  const courseCatalogQueries = queryClient.getQueriesData({ queryKey: courseKeys.catalogs() }) as [
    unknown,
    InfiniteData<CoursesPage, number>,
  ][];

  return React.useMemo(
    () =>
      new Map(
        courseCatalogQueries
          .flatMap(([_, data]) => data?.pages)
          .flatMap((p) => p?.content)
          .map((c) => [c?.id, c])
      ),
    [courseCatalogQueries]
  );
};
