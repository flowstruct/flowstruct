import type { PressEvent } from 'react-aria';
import { canSelectPrerequisite, type Course } from './course.ts';
import type { Placement, Term } from './flowsheet.ts';
import { classifyRelationship, type Relationship, type Requisites } from './courses-graph.ts';

type DeletePlacementsArgs = {
  courses: Record<string, Course>;
  placements: Placement[];
  placementIds: string[];
};

export const deletePlacements = ({
  courses,
  placements,
  placementIds,
}: DeletePlacementsArgs): Pick<DeletePlacementsArgs, 'courses' | 'placements'> => {
  const placementIdsSet = new Set(placementIds);

  const updatedCourses = { ...courses };

  const updatedPlacements = placements.filter((p) => {
    if (!placementIdsSet.has(p.id)) return true;

    if (p.type === 'COURSE') {
      delete updatedCourses[p.course];
    }
    // handle elective slot deletion
    return false;
  });

  return {
    courses: updatedCourses,
    placements: updatedPlacements,
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
  const prerequisiteAllowed = focusedPlacement ? canSelectPrerequisite({ source: placement.course, target: focusedPlacement.course, terms, coursesGraph: graph }) : false;

  const relation = focusedPlacement
    ? classifyRelationship(focusedPlacement.course, placement.course, graph)
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
  const source = placements[sourceId];
  const target = placements[targetId];

  if (!source || !target) return placements;

  // clone into a fresh output record
  const next: Record<string, Placement> = { ...placements };

  // 1. Remove source from source term (shift down everything after it)
  Object.values(next).forEach(p => {
    if (p.term === source.term && p.position > source.position) {
      next[p.id] = { ...p, position: p.position - 1 };
    }
  });

  // 2. Compute new insertion position
  const insertPos =
    dropLocation === 'before'
      ? target.position
      : target.position + 1;

  // 3. Shift up target term placements to make space
  Object.values(next).forEach(p => {
    if (p.term === target.term && p.position >= insertPos) {
      next[p.id] = { ...p, position: p.position + 1 };
    }
  });

  // 4. Move source into target term
  next[sourceId] = {
    ...next[sourceId],
    term: target.term,
    position: insertPos
  };

  return next;
}

function shiftPlacements(placements: Placement[], delta: number) {


}

function insertPlacement(inserted: Placement, position: number, placements: Placement[]) {
  if (position > placements.length + 1) {
    return placements;
  }

  placements
}
