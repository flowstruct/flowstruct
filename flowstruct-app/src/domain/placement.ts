import { canSelectPrerequisite, type Course } from './course.ts';
import { classifyRelationship, type Relationship, type Requisites } from './courses-graph.ts';
import type { Placement, Term } from './flowsheet.ts';

type DeletePlacementsArgs = {
  courses: Record<string, Course>;
  placements: Record<string, Placement>;
  placementIds: string[];
};

export function deletePlacements({
  courses,
  placements,
  placementIds,
}: DeletePlacementsArgs): Pick<DeletePlacementsArgs, "courses" | "placements"> {
  const placementIdsSet = new Set(placementIds);

  const updatedCourses = { ...courses };

  const remainingEntries = Object.entries(placements).filter(([id, p]) => {
    if (!placementIdsSet.has(id)) return true;

    if (p.type === "COURSE") {
      delete updatedCourses[p.item];
    }

    return false;
  });

  const remainingPlacements: Record<string, Placement> = {};
  for (const [id, p] of remainingEntries) {
    remainingPlacements[id] = p;
  }

  const byTerm: Record<string, Placement[]> = {};
  for (const p of Object.values(remainingPlacements)) {
    if (!byTerm[p.term]) byTerm[p.term] = [];
    byTerm[p.term].push(p);
  }

  const normalized: Record<string, Placement> = { ...remainingPlacements };

  for (const term in byTerm) {
    const items = byTerm[term].sort((a, b) => a.position - b.position);

    items.forEach((p, index) => {
      normalized[p.id] = {
        ...p,
        position: index + 1,
      };
    });
  }

  return {
    courses: updatedCourses,
    placements: normalized,
  };
};

export type PlacementState = {
  isFocused: boolean;
  isSelected: boolean;
  relation: Relationship;
  prerequisiteAllowed: boolean;
};

export function getPlacementState({
  placement,
  focusedPlacement,
  selectedPlacements,
  terms,
  graph,
}: {
  placement: Placement;
  focusedPlacement: Placement | null;
  selectedPlacements: Set<string>;
  terms: Term[];
  graph: Map<string, Requisites>;
}): PlacementState {
  const isFocused = focusedPlacement?.id === placement.id;
  const isSelected = selectedPlacements.has(placement.id);
  const prerequisiteAllowed = focusedPlacement ? canSelectPrerequisite({ sourceId: placement.item, targetId: focusedPlacement.item, terms, coursesGraph: graph }) : false;

  const relation = focusedPlacement
    ? classifyRelationship(focusedPlacement.item, placement.item, graph)
    : "UNRELATED";

  return {
    isFocused, isSelected, prerequisiteAllowed, relation
  };
}

export type PlacementPerms = {
  exitLinkingMode: boolean;
  togglePrerequisite: boolean;
  toggleSelect: boolean;
  toggleFocus: boolean;
};

export function reorderPlacements(
  sourceId: string,
  targetId: string,
  dropLocation: 'before' | 'after',
  placements: Record<string, Placement>
): Record<string, Placement> {
  if (sourceId === targetId) return placements;

  const source = placements[sourceId];
  const target = placements[targetId];

  if (!source || !target) return placements;

  const next = { ...placements };

  const sourceTermPlacements = Object.values(next).filter(p => p.term === source.term);

  sourceTermPlacements.forEach(p => {
    if (p.position >= source.position) {
      next[p.id] = { ...p, position: p.position - 1 };
    }
  });

  const targetTermPlacements = Object.values(next).filter(p => p.term === target.term);

  let insertPos = dropLocation === 'before'
    ? target.position
    : target.position + 1;

  if (insertPos >= targetTermPlacements.length + 1 && source.term === target.term) {
    insertPos = target.position;
  }

  targetTermPlacements.forEach(p => {
    if (p.position >= insertPos) {
      next[p.id] = { ...p, position: p.position + 1 };
    }
  });

  next[sourceId] = {
    ...next[sourceId],
    term: target.term,
    position: insertPos
  };

  return next;
}

export function appendToTerm(placement: Placement, targetTerm: string, placements: Record<string, Placement>) {
  const next = { ...placements };

  if (placement.term !== targetTerm) {
    const sourceTermPlacements = Object.values(next).filter(p => p.term === placement.term);

    sourceTermPlacements.forEach(p => {
      if (p.position >= placement.position) {
        next[p.id] = { ...p, position: p.position - 1 };
      }
    });
  }

  const targetTermPlacements = Object.values(next).filter(p => p.term === targetTerm);

  next[placement.id] = {
    ...placement,
    term: targetTerm,
    position: targetTermPlacements.length + 1
  };

  return next;
}
