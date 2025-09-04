import type { CoursePlacement } from '../types';

export const getTermIndexFromPlacement = (
  placement: Pick<CoursePlacement, 'year' | 'semester'>
): number => {
  const SEMESTERS_PER_YEAR = 3;
  return (placement.year - 1) * SEMESTERS_PER_YEAR + (placement.semester - 1);
};
