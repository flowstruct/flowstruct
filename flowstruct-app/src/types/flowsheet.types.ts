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
}

export type Placement =
    | {
    type: 'COURSE';
    course: string;
    term: Term;
    position: number;
    span: number;
}
    | {
    type: 'ELECTIVE_SLOT';
    electiveSlot: string;
    term: Term;
    position: number;
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
    section: string;
    prerequisites: string[];
    corequisites: string[];
};

export type Flowsheet = {
    id: string;
    year: number;
    name: string;
    status: string;
    program: number;
    sections: Section[];
    placements: Placement[];
    courses: Record<string, Course>;
};

export type Term = number;
