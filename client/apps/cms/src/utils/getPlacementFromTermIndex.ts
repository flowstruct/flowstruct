import { CoursePlacement } from '@/features/study-plan/types.ts';

export const getPlacementFromTermIndex = (
  termIndex: number
): Pick<CoursePlacement, 'year' | 'semester'> => {
  const SEMESTERS_PER_YEAR = 3;
  const year = Math.ceil((termIndex + 1) / SEMESTERS_PER_YEAR);
  const semester = (termIndex % SEMESTERS_PER_YEAR) + 1;
  return { year, semester };
};
