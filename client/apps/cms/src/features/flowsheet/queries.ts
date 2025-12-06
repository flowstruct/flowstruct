import { queryOptions } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { courseApi } from '@/features/course/api.ts';

export const flowsheetKeys = {
  all: ['flowsheets'] as const,
  collection: () => [...flowsheetKeys.all, 'list'] as const,
  details: () => [...flowsheetKeys.all, 'detail'] as const,
  detail: (id: number) => [...flowsheetKeys.details(), id] as const,
  courseCollections: () => [...flowsheetKeys.all, 'courses'] as const,
  courseCollection: (flowsheetId: number) =>
    [...flowsheetKeys.courseCollections(), flowsheetId] as const,
};

export const flowsheetQueries = {
  collection: queryOptions({
    queryKey: flowsheetKeys.collection(),
    queryFn: () => flowsheetApi.getFlowsheets(),
    select: (data) => ({
      list: data,
      byIds: Object.fromEntries(data.map((d) => [d.id, d])),
    }),
  }),

  detail: (flowsheetId: number) =>
    queryOptions({
      queryKey: flowsheetKeys.detail(flowsheetId),
      queryFn: () => flowsheetApi.getFlowsheet(flowsheetId),
      select: (data) => ({
        ...data,
        placementsByCourse: Object.fromEntries(
          data.placements.map((p) => [p.course, p])
        ),
        termsById: Object.fromEntries(
          data.terms.map((t) => [t.id, t])
        ),
      })
    }),

  courseCollection: (flowsheetId: number) =>
    queryOptions({
      queryKey: flowsheetKeys.courseCollection(flowsheetId),
      queryFn: async ({ client }) => {
        const flowsheet = await client.fetchQuery(flowsheetQueries.detail(flowsheetId));
        const courseIds = flowsheet.placements.map((p) => p.course);

        return courseApi.getCourses(courseIds);
      },
      select: (data) => ({
        list: data,
        byIds: Object.fromEntries(data.map((c) => [c.id, c])),
      }),
      enabled: !!flowsheetId,
    }),
};
