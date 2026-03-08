import type { Requisites } from './buildCoursesGraph';
import type { Placement, Term } from './flowsheet';

export function computeAllowedTerms(
  courseId: number,
  coursesGraph: Map<number, Requisites>,
  termAndPlacementByCourse: Record<number, { term: Term; placement: Placement }>,
  terms: Term[]
): Set<number> {
  const requisites = coursesGraph.get(courseId);

  if (!requisites) {
    return new Set(terms.map((t) => t.id));
  }

  let maxPrereqTermNumber = -Infinity;

  requisites.prerequisiteSequence.forEach((prereqCourseId) => {
    const entry = termAndPlacementByCourse[prereqCourseId];

    if (entry && entry.term.termNumber > maxPrereqTermNumber) {
      maxPrereqTermNumber = entry.term.termNumber;
    }
  });

  let minPostreqTermNumber = Infinity;

  requisites.postrequisiteSequence.forEach((postreqCourseId) => {
    const entry = termAndPlacementByCourse[postreqCourseId];

    if (entry && entry.term.termNumber < minPostreqTermNumber) {
      minPostreqTermNumber = entry.term.termNumber;
    }
  });

  const allowed = new Set<number>();

  for (const term of terms) {
    if (term.termNumber > maxPrereqTermNumber && term.termNumber < minPostreqTermNumber) {
      allowed.add(term.id);
    }
  }

  return allowed;
}
