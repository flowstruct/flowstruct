import type { Course } from '../types';

export const sortByCourseCode = (a: Course, b: Course, programCode: string) => {
  const parseCode = (code: string) => {
    const match = code.match(/^([A-Z]+)(\d+)/);
    if (!match) return { dept: '', num: 0 };

    const dept = match[1];
    const fullNum = match[2];
    const baseNum = parseInt(fullNum.replace(/0+$/, ''));
    const secondaryNum = parseInt(fullNum);

    const isGermanCourse = dept === 'GERL';
    const isProgramCourse = dept === programCode;

    return {
      dept,
      baseNum,
      secondaryNum,
      isGermanCourse,
      isProgramCourse,
    };
  };

  const codeA = parseCode(a.code);
  const codeB = parseCode(b.code);

  if (codeA.isGermanCourse !== codeB.isGermanCourse) {
    return codeB.isGermanCourse ? 1 : -1;
  }

  if (codeA.isProgramCourse !== codeB.isProgramCourse) {
    return codeB.isProgramCourse ? 1 : -1;
  }

  if (codeA.dept !== codeB.dept) {
    return codeA.dept.localeCompare(codeB.dept);
  }

  if (codeA.baseNum !== codeB.baseNum) {
    return codeA.baseNum - codeB.baseNum;
  }

  return codeA.secondaryNum - codeB.secondaryNum;
};
