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

export type CourseRelation = 'SELF' | 'PREREQ' | 'PREREQSEQ' | 'COREQ' | 'POSTREQSEQ' | 'UNRELATED';

export type Section = {
  id: number;
  level: SectionLevel;
  type: SectionType;
  requiredCreditHours: number;
  name: string;
  position: number;
  courses: number[];
};

export type Term = {
  id: number;
  termNumber: number;
  name: string;
  placements: Placement[];
};

export type Placement = {
  course: number;
  position: number;
  span: number;
};

type CoursePrerequisite = { course: number; prerequisite: number };

type CourseCorequisite = { course: number; corequisite: number };

export type Flowsheet = {
  id: number;
  year: number;
  name: string;
  status: string;
  program: number;
  sections: Section[];
  terms: Term[];
  coursePrerequisites: CoursePrerequisite[];
  courseCorequisites: CourseCorequisite[];
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
