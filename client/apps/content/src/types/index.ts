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
  isPrivate: boolean;
};

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

export type Course = {
  id: number;
  code: string;
  name: string;
  creditHours: number;
  ects: number;
  lectureHours: number;
  practicalHours: number;
  type: string;
  isRemedial: boolean;
  outdatedAt: Date;
  outdatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
};

export type Section = {
  id: number;
  level: SectionLevel;
  type: SectionType;
  requiredCreditHours: number;
  name: string | null;
  position: number;
  courses: number[];
};

export type CourseSequences = {
  prerequisiteSequence: Set<number>;
  postrequisiteSequence: Set<number>;
};

export type CoursePlacement = {
  year: number;
  semester: number;
  position: number;
  span: number;
};

export type StudyPlan = {
  id: number;
  year: number;
  duration: number;
  track: string;
  status: string;
  program: number;
  sections: Section[];
  coursePlacements: Record<number, CoursePlacement>;
  coursePrerequisites: Record<number, Record<number, CourseRelation>>;
  courseCorequisites: Record<number, number[]>;
  archivedAt: Date;
  archivedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
};

export type StudyPlanSequences = {
  coursePlacements: Record<number, CoursePlacement>;
  coursePrerequisites: Record<number, Record<number, CourseRelation>>;
  courseCorequisites: Record<number, number[]>;
  courseSequences: Record<number, CourseSequences>;
};

export type StudyPlanSummary = Pick<
  StudyPlan,
  | 'id'
  | 'year'
  | 'duration'
  | 'track'
  | 'status'
  | 'program'
  | 'archivedAt'
  | 'archivedBy'
  | 'createdAt'
  | 'updatedAt'
  | 'updatedBy'
>;
