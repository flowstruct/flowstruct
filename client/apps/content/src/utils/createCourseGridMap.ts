import { getTermIndexFromPlacement } from './getTermIndexFromPlacement.ts';
import type { StudyPlan } from '../types';

type GridCell = {
  column: number;
  row: number;
  span: number;
};

const createCourseGridCellMap = (studyPlan: StudyPlan) => {
  const coursesByTermIndex = new Map<number, number[]>(
    Array.from({ length: studyPlan.duration * 3 }, (_, i) => [i, []] as [number, number[]])
  );

  for (const [courseIdStr, placement] of Object.entries(studyPlan.coursePlacements)) {
    const courseId = Number(courseIdStr);
    const ti = getTermIndexFromPlacement(placement);
    coursesByTermIndex.get(ti)!.push(courseId);
  }

  coursesByTermIndex.forEach((arr) =>
    arr.sort(
      (a, b) => studyPlan.coursePlacements[a].position - studyPlan.coursePlacements[b].position
    )
  );

  const filteredTermIndices = Array.from(coursesByTermIndex.entries())
    .filter(([, arr]) => arr.length > 0)
    .map(([termIndex]) => termIndex)
    .sort((a, b) => a - b);

  const termIndexToColumn = new Map<number, number>();
  filteredTermIndices.forEach((termIndex, i) => {
    termIndexToColumn.set(termIndex, i + 1);
  });

  const courseGridMap = new Map<number, GridCell>();
  const columnHeights = new Map<number, number>();

  for (const termIndex of filteredTermIndices) {
    let row = 1;
    const courseIds = coursesByTermIndex.get(termIndex)!;
    const column = termIndexToColumn.get(termIndex)!;

    for (const courseId of courseIds) {
      const placement = studyPlan.coursePlacements[courseId];
      const span = placement.span;

      courseGridMap.set(courseId, { column, row, span });
      row += span;
    }

    columnHeights.set(termIndex, row);
  }

  const gridWidth = filteredTermIndices.length;
  const gridHeight = filteredTermIndices.length
    ? Math.max(...Array.from(columnHeights.values()))
    : 0;

  return {
    courseGridMap,
    filteredTermIndices,
    gridWidth,
    gridHeight,
    coursesByTermIndex,
    columnHeights,
  };
};

export { createCourseGridCellMap };
export type { GridCell };
