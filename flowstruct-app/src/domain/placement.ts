import type { Flowsheet, Placement } from './flowsheet.ts';

const findPlacementIndex = (placements: Placement[], placementId: string): number => {
  return placements.findIndex((p) => p.id === placementId);
};

type InsertPlacementsInTermArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placements: Placement[];
  targetPlacementId: string;
  position: 'before' | 'after';
};

export const insertPlacementsInTerm = ({
  flowsheet,
  termIndex,
  placements,
  targetPlacementId,
  position,
}: InsertPlacementsInTermArgs): Flowsheet => {
  const updatedTerms = flowsheet.terms.map((term) => {
    if (term.index !== termIndex) return term;

    const targetIndex = findPlacementIndex(term.placements, targetPlacementId);
    if (targetIndex === -1) return term;

    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;

    return {
      ...term,
      placements: [
        ...term.placements.slice(0, insertIndex),
        ...placements,
        ...term.placements.slice(insertIndex),
      ],
    };
  });

  return {
    ...flowsheet,
    terms: updatedTerms,
  };
};

type AppendPlacementsToTermArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placements: Placement[];
};

export const appendPlacementsToTerm = ({
  flowsheet,
  termIndex,
  placements,
}: AppendPlacementsToTermArgs): Flowsheet => {
  let updatedTerms = [...flowsheet.terms];

  if (!updatedTerms.find((t) => t.index === termIndex)) {
    updatedTerms.push({ index: termIndex, placements: [] });
  }

  updatedTerms = updatedTerms.map((term) => {
    if (term.index !== termIndex) return term;

    return {
      ...term,
      placements: [...term.placements, ...placements],
    };
  });

  return {
    ...flowsheet,
    terms: updatedTerms,
  };
};

type ReorderPlacementsInTermArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placementIds: string[];
  targetPlacementId: string;
  position: 'before' | 'after';
};

export const reorderPlacementsInTerm = ({
  flowsheet,
  termIndex,
  placementIds,
  targetPlacementId,
  position,
}: ReorderPlacementsInTermArgs): Flowsheet => {
  const updatedTerms = flowsheet.terms.map((term) => {
    if (term.index !== termIndex) return term;

    const targetIndex = findPlacementIndex(term.placements, targetPlacementId);
    if (targetIndex === -1) return term;

    const placementIdSet = new Set(placementIds);
    const toMove: Placement[] = [];
    const remaining: Placement[] = [];

    term.placements.forEach((placement) => {
      if (placementIdSet.has(placement.id)) {
        toMove.push(placement);
      } else {
        remaining.push(placement);
      }
    });

    const newTargetIndex = remaining.findIndex((p) => p.id === targetPlacementId);
    if (newTargetIndex === -1) return term;

    const insertIndex = position === 'before' ? newTargetIndex : newTargetIndex + 1;

    return {
      ...term,
      placements: [...remaining.slice(0, insertIndex), ...toMove, ...remaining.slice(insertIndex)],
    };
  });

  return {
    ...flowsheet,
    terms: updatedTerms,
  };
};

type RemovePlacementsFromTermArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placementIds: string[];
};

export const removePlacementsFromTerm = ({
  flowsheet,
  termIndex,
  placementIds,
}: RemovePlacementsFromTermArgs): Flowsheet => {
  const placementIdSet = new Set(placementIds);

  const updatedTerms = flowsheet.terms.map((term) => {
    if (term.index !== termIndex) return term;

    return {
      ...term,
      placements: term.placements.filter((p) => !placementIdSet.has(p.id)),
    };
  });

  return {
    ...flowsheet,
    terms: updatedTerms,
  };
};

type DeletePlacementsArgs = {
  flowsheet: Flowsheet;
  placementIds: string[];
};

export const deletePlacements = ({ flowsheet, placementIds }: DeletePlacementsArgs): Flowsheet => {
  const placementIdsSet = new Set(placementIds);

  const updatedCourses = { ...flowsheet.courses };

  const updatedTerms = flowsheet.terms.map((term) => {
    const updatedPlacements = term.placements.filter((p) => {
      if (!placementIdsSet.has(p.id)) return true;

      if (p.type === 'COURSE') {
        delete updatedCourses[p.course];
      }
      // handle elective slot deletion
      return false;
    });

    return { ...term, placements: updatedPlacements };
  });

  return {
    ...flowsheet,
    terms: updatedTerms,
    courses: updatedCourses,
  };
};
