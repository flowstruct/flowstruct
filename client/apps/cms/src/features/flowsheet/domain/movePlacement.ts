import { Flowsheet, Placement } from '@/features/flowsheet/domain/flowsheet.ts';

function shiftPositions(
  placements: Placement[],
  targetTerm: number,
  targetPosition: number,
  delta: number
): Placement[] {
  return placements.map((p) => {
    if (p.term === targetTerm && p.position >= targetPosition) {
      return { ...p, position: p.position + delta };
    }
    return p;
  });
}

export function movePlacement(
  flowsheet: Flowsheet,
  courseId: number,
  targetTerm: number,
  targetPosition: number
): Flowsheet {
  const oldPlacement = flowsheet.placements.find((p) => p.courseId === courseId);

  if (!oldPlacement) {
    return flowsheet;
  }

  let updatedPlacements = flowsheet.placements.filter((p) => p.courseId !== courseId);

  updatedPlacements = shiftPositions(
    updatedPlacements,
    oldPlacement.term,
    oldPlacement.position,
    -1
  );

  updatedPlacements = shiftPositions(updatedPlacements, targetTerm, targetPosition, +1);

  updatedPlacements.push({
    courseId,
    term: targetTerm,
    position: targetPosition,
    span: oldPlacement.span,
  });

  return {
    ...flowsheet,
    placements: updatedPlacements,
  };
}
