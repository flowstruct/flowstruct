import type { Course } from './course';

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
      id: string;
      type: 'COURSE';
      course: string;
      span: number;
    }
  | {
      id: string;
      type: 'ELECTIVE_SLOT';
      electiveSlot: string;
      span: number;
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
