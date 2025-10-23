import type { Flowsheet, Placement } from './flowsheet.ts';

const findPlacementIndex = (placements: Placement[], placementId: string): number => {
  return placements.findIndex((p) => p.id === placementId);
};

type InsertPlacementsArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placements: Placement[];
  targetPlacementId: string;
  position: 'before' | 'after';
};

export const insertPlacements = ({
  flowsheet,
  termIndex,
  placements,
  targetPlacementId,
  position,
}: InsertPlacementsArgs): Flowsheet => {
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

type AppendPlacementsArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placements: Placement[];
};

export const appendPlacements = ({
  flowsheet,
  termIndex,
  placements,
}: AppendPlacementsArgs): Flowsheet => {
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

type ReorderPlacementsArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placementIds: string[];
  targetPlacementId: string;
  position: 'before' | 'after';
};

export const reorderPlacements = ({
  flowsheet,
  termIndex,
  placementIds,
  targetPlacementId,
  position,
}: ReorderPlacementsArgs): Flowsheet => {
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

type RemovePlacementsArgs = {
  flowsheet: Flowsheet;
  termIndex: number;
  placementIds: string[];
};

export const removePlacements = ({
  flowsheet,
  termIndex,
  placementIds,
}: RemovePlacementsArgs): Flowsheet => {
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
