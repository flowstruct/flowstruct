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

export const TERM_NAMES = ['First Semester', 'Second Semester', 'Summer Semester'] as const;

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

export type FlowsheetSummary = Pick
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


export const CourseType = {
  F2F: 'Face-to-Face',
  BLD: 'Blended',
  OL: 'Online',
} as const;

export type Course = {
  id: number;
  code: string;
  name: string;
  creditHours: number;
  ects: number;
  lectureHours: number;
  practicalHours: number;
  type: string;
  outdatedAt: Date;
  outdatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
};

export type CoursesPage = {
  content: CourseSummary[];
  page: number;
  size: number;
  totalCourses: number;
  totalPages: number;
  isLastPage: boolean;
};

export type CourseSummary = Pick
  Course,
  | 'id'
  | 'code'
  | 'name'
  | 'creditHours'
  | 'type'
  | 'outdatedAt'
  | 'outdatedBy'
  | 'createdAt'
  | 'updatedAt'
  | 'updatedBy'
>;

export const Degree = {
  BSc: 'Bachelor of Science',
  BA: 'Bachelor of Arts',
  MBA: 'Master of Business Administration',
  PHD: 'Doctor of Philosophy',
} as const;

export type Program = {
  id: number;
  code: string;
  name: string;
  degree: string;
  outdatedAt: Date;
  outdatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
};
