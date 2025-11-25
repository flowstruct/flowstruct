import type { Requisites } from './courses-graph.ts';
import type { Term } from './flowsheet.ts';

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
  sourceId: string,
  targetId: string,
  coursesGraph: Map<string, Requisites>,
  terms: Record<string, Term>
) {
  const sourceRequisites = coursesGraph.get(sourceId);
  const targetRequisites = coursesGraph.get(targetId);

  return true;
}
