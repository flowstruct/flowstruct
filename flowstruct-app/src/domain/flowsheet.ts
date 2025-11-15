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
      term: string;
    }
  | {
      id: string;
      type: 'ELECTIVE_SLOT';
      electiveSlot: string;
      span: number;
      term: string;
    };

export type Flowsheet = {
  id: string;
  program: string;
  year: number;
  name: string;
};

export type Term = {
  id: string;
  name: string;
};
