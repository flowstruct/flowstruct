import { CoursePlacement } from '@/features/study-plan/types.ts';

export const comparePlacement = (
  p1: Pick<CoursePlacement, 'year' | 'semester'>,
  p2: Pick<CoursePlacement, 'year' | 'semester'>
): number => {
  const index1 = (p1.year - 1) * 3 + p1.semester;
  const index2 = (p2.year - 1) * 3 + p2.semester;

  return index1 - index2;
};
