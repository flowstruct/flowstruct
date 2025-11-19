import type { Requisites } from './courses-graph.ts';
import type { Flowsheet, Placement, Term } from './flowsheet.ts';

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

type CanSelectPrerequisiteArgs = {
  source: Placement;
  target: Placement;
  terms: Term[];
  coursesGraph: Map<string, Requisites>;
};

export function canSelectPrerequisite({
  source,
  target,
  terms,
  coursesGraph,
}: CanSelectPrerequisiteArgs) {
  // check target's term less than 
}
