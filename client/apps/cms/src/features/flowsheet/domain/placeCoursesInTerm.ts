import { Flowsheet, Placement, Term } from '@/features/flowsheet/domain/flowsheet.ts';

type PlaceCoursesParams = {
  flowsheet: Flowsheet;
  courseIds: number[];
  term: Term;
};

export function placeCoursesInTerm({ flowsheet, courseIds, term }: PlaceCoursesParams): Flowsheet {
  const placedCourseIds = new Set(flowsheet.placements.map((p) => p.course));

  for (const courseId of courseIds) {
    if (placedCourseIds.has(courseId)) {
      throw new Error(`Course ${courseId} is already placed in the flowsheet`);
    }
  }

  const termPlacements = flowsheet.placements.filter((p) => p.term === term);
  const otherPlacements = flowsheet.placements.filter((p) => p.term !== term);

  const delta = courseIds.length;

  const shiftedPlacements: Placement[] = termPlacements.map((p) => ({
    ...p,
    position: p.position + delta,
  }));

  const newPlacements: Placement[] = courseIds.map((courseId, index) => ({
    course: courseId,
    term,
    position: index + 1,
    span: 1,
  }));

  return {
    ...flowsheet,
    placements: [...otherPlacements, ...newPlacements, ...shiftedPlacements],
  };
}
