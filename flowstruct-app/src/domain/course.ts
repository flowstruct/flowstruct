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
  termId: string;
};

export const addCourse = ({ flowsheet, course, termId }: AddCourseArgs) => {
  return {
    ...flowsheet,
    courses: { ...flowsheet.courses, [course.id]: course },
    placements: [
      ...flowsheet.placements,
      { type: 'COURSE', course: course.id, span: 1, term: termId },
    ],
  };
};

type EditCourseArgs = {
  flowsheet: Flowsheet;
  updatedCourse: Course;
};

export const editCourse = ({ flowsheet, updatedCourse }: EditCourseArgs) => {
  return {
    ...flowsheet,
    courses: {
      ...flowsheet.courses,
      [updatedCourse.id]: updatedCourse,
    },
  };
};
