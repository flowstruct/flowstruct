import { getTermIndexFromPlacement } from '@/utils/getTermIndexFromPlacement.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

type GridCell = {
  column: number;
  row: number;
  span: number;
};

function createCourseGridCellMap(studyPlan: StudyPlan) {
  const courseGridMap = new Map<number, GridCell>();
  const coursesByTermIndex = new Map<number, number[]>(
    Array.from({ length: studyPlan.duration * 3 }, (_, i) => [i, []] as [number, number[]])
  );

  Object.entries(studyPlan.coursePlacements).forEach(([courseIdStr, placement]) => {
    const courseId = Number(courseIdStr);
    const termIndex = getTermIndexFromPlacement(placement);
    coursesByTermIndex.get(termIndex)!.push(courseId);
  });

  coursesByTermIndex.forEach((courseIds) => {
    courseIds.sort(
      (a, b) => studyPlan.coursePlacements[a].position - studyPlan.coursePlacements[b].position
    );
  });

  const columnHeights = new Map<number, number>();

  coursesByTermIndex.forEach((courseIds, termIndex) => {
    let currentGridRow = 1;

    courseIds.forEach((courseId) => {
      const placement = studyPlan.coursePlacements[courseId];

      courseGridMap.set(courseId, {
        column: termIndex + 1,
        row: currentGridRow,
        span: placement.span,
      });

      currentGridRow += placement.span;
    });

    columnHeights.set(termIndex, currentGridRow);
  });

  const gridWidth = studyPlan.duration * 3;
  const gridHeight = Math.max(...Array.from(columnHeights.values()), 0);

  return {
    courseGridMap,
    gridHeight,
    gridWidth,
    coursesByTermIndex,
    columnHeights,
  };
}

export { createCourseGridCellMap, type GridCell };
