export type Section = {
  id: string;
  level: 'University' | 'School' | 'Program';
  type: 'Requirement' | 'Elective' | 'remedial';
  requiredCreditHours: number;
  name: string;
  position: number;
  courses: string[];
};

export type ElectiveSlot = {
  id: string;
  name: string;
  section: string;
};

export type Placement =
  | {
      type: 'COURSE';
      course: string;
      span: number;
    }
  | {
      type: 'ELECTIVE_SLOT';
      electiveSlot: string;
      span: number;
    };

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

export type Flowsheet = {
  id: string;
  program: string;
  year: number;
  name: string;
  sections: Section[];
  terms: Term[];
  courses: Record<string, Course>;
};

export type Term = {
  index: number;
  placements: Placement[];
};
