import { classifyRelationship, type CourseRelation, type Requisites } from './courses-graph.ts';
import type { Placement, Term } from './flowsheet.ts';

export const CourseType = {
  F2F: 'Face-to-Face',
  BLD: 'Blended',
  OL: 'Online',
} as const;

export type Course = {
  id: string;
  code: string;
  name: string;
  creditHours: number;
  ects: number;
  lectureHours: number;
  practicalHours: number;
  type: string;
  prerequisites: string[];
  corequisites: string[];
};

export function validatePrerequisite(
  source: Placement,
  target: Placement,
  terms: Record<string, Term>,
  relation: CourseRelation
) {
  if (source.id === target.id) return false;

  const targetAheadOfSource = terms[target.term].position >= terms[source.term].position;
  const isCyclic = relation === 'POSTREQSEQ';

  if (targetAheadOfSource || isCyclic) return false;

  return true;
}
