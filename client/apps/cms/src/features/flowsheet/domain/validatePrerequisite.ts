import { Term, CourseRelation, Placement } from "@/features/flowsheet/domain/flowsheet";

export function validatePrerequisite(
  source: Placement,
  target: Placement,
  terms: Record<number, Term>,
  relation: CourseRelation
) {
  if (source.course === target.course) return false;

  const targetAheadOfSource = terms[target.term].position >= terms[source.term].position;
  const isCyclic = relation === 'POSTREQSEQ';

  if (targetAheadOfSource || isCyclic) return false;

  return true;
}
