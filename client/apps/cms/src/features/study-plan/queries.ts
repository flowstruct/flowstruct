import { queryOptions } from '@tanstack/react-query';
import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan, StudyPlanSummary } from '@/features/study-plan/types.ts';
import { CourseSummary } from '@/features/course/types.ts';

export const studyPlanKeys = {
  all: ['study-plans'] as const,
  list: () => [...studyPlanKeys.all, 'list'] as const,
  details: () => [...studyPlanKeys.all, 'detail'] as const,
  detail: (id: number) => [...studyPlanKeys.details(), id] as const,
  courseLists: () => [...studyPlanKeys.all, 'courses'] as const,
  courseList: (studyPlanId: number) => [...studyPlanKeys.courseLists(), studyPlanId] as const,
  programs: () => [...studyPlanKeys.all, 'programs'] as const,
  program: (studyPlanId: number) => [...studyPlanKeys.programs(), studyPlanId] as const,
};

export const StudyPlanListQuery = queryOptions({
  queryKey: studyPlanKeys.list(),
  queryFn: () => api.get<StudyPlanSummary[]>(STUDY_PLAN_ENDPOINT),
});

export const StudyPlanQuery = (studyPlanId: number) =>
  queryOptions({
    queryKey: studyPlanKeys.detail(studyPlanId),
    queryFn: () => api.get<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId]),
  });

export const StudyPlanCourseListQuery = (studyPlanId: number) =>
  queryOptions({
    queryKey: studyPlanKeys.courseList(studyPlanId),
    queryFn: () =>
      api.get<Record<number, CourseSummary>>([STUDY_PLAN_ENDPOINT, studyPlanId, 'courses']),
    enabled: !!studyPlanId,
  });
