import type { Flowsheet } from './flowsheet.ts';

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

type AddCourseArgs = {
  flowsheet: Flowsheet;
  course: Course;
  termIndex: number;
};

export const addCourse = ({ flowsheet, course, termIndex }: AddCourseArgs) => {
  const newTerms = [...flowsheet.terms];

  if (!newTerms.find((t) => t.index === termIndex)) {
    newTerms.push({ index: termIndex, placements: [] });
  }

  const updatedTerms = newTerms.map((t) => {
    if (t.index !== termIndex) return t;
    return {
      ...t,
      placements: [
        ...t.placements,
        { id: crypto.randomUUID(), type: 'COURSE' as const, course: course.id, span: 1 },
      ],
    };
  });

  return {
    ...flowsheet,
    courses: { ...flowsheet.courses, [course.id]: course },
    terms: updatedTerms,
  };
};
