export enum SectionLevel {
  University = 'University',
  School = 'School',
  Program = 'Program',
}

export enum SectionType {
  Requirement = 'Requirement',
  Elective = 'Elective',
  Remedial = 'Remedial',
}

export enum CourseRelation {
  AND = 'AND',
  OR = 'OR',
}

export type Section = {
  id: number;
  level: SectionLevel;
  type: SectionType;
  requiredCreditHours: number;
  name: string;
  position: number;
  courses: number[];
};

export type Placement = {
  course: number;
  term: number;
  position: number;
  span: number;
};

export type Flowsheet = {
  id: number;
  year: number;
  name: string;
  status: string;
  program: number;
  sections: Section[];
  placements: Placement[];
  coursePrerequisites: Record<number, Record<number, CourseRelation>>;
  courseCorequisites: Record<number, number[]>;
  archivedAt: Date;
  archivedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
};

export type FlowsheetSummary = Pick<
  Flowsheet,
  | 'id'
  | 'year'
  | 'name'
  | 'status'
  | 'program'
  | 'archivedAt'
  | 'archivedBy'
  | 'createdAt'
  | 'updatedAt'
  | 'updatedBy'
>;

export type ArchiveStatus = 'all' | 'active' | 'archived';

export type Term = number;