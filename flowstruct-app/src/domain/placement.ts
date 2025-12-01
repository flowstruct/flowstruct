import type { FlowsheetGridState } from '../hooks/flowsheet-grid.hook.tsx';
import { validatePrerequisite, type Course } from './course.ts';
import { classifyRelationship, type CourseRelation, type Requisites } from './courses-graph.ts';
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
}: DeletePlacementsArgs): Pick<DeletePlacementsArgs, 'courses' | 'placements'> {
  const placementIdsSet = new Set(placementIds);

  const updatedCourses = { ...courses };

  const remainingEntries = Object.entries(placements).filter(([id, p]) => {
    if (!placementIdsSet.has(id)) return true;

    if (p.type === 'COURSE') {
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
}

export type PlacementVisualState =
  | 'NORMAL'
  | 'FOCUSED'
  | 'SELECTED'
  | 'SELECTABLE'
  | 'LINK_SOURCE'
  | 'PREREQ_LINK'
  | 'COREQ_LINK'
  | 'AVAILABLE_LINK'
  | 'DISABLED_LINK'
  | CourseRelation;

export function getPlacementState({
  placement,
  state,
  placements,
  terms,
  graph,
}: {
  placement: Placement;
  state: FlowsheetGridState;
  placements: Record<string, Placement>;
  terms: Record<string, Term>;
  graph: Map<string, Requisites>;
}): PlacementVisualState {
  if (state.selected.size > 0) {
    const isSelected = state.selected.has(placement.id);

    if (isSelected) return 'SELECTED';

    return 'SELECTABLE';
  }

  if (state.focused) {
    const isFocused = state.focused === placement.id;

    if (isFocused) return 'FOCUSED';

    const source = placements[state.focused].item;
    const target = placement.item;

    const relation = classifyRelationship(source, target, graph);

    return relation;
  }

  if (state.linkSource) {
    const isLinkSource = state.linkSource === placement.id;

    if (isLinkSource) return 'LINK_SOURCE';

    const source = placements[state.linkSource!];
    const target = placements[placement.id];

    if (!source || !target) return 'DISABLED_LINK';

    const relation = classifyRelationship(source.item, target.item, graph);

    if (state.linkType === 'PREREQ') {
      if (relation === 'PREREQ') return 'PREREQ_LINK';

      const allowed = validatePrerequisite(source, target, terms, relation);

      return allowed ? 'AVAILABLE_LINK' : 'DISABLED_LINK';
    }

    if (state.linkType === 'COREQ') {
      if (relation === 'COREQ') return 'COREQ_LINK';

      return 'AVAILABLE_LINK';
    }
  }

  return 'NORMAL';
}

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

  const sourceTermPlacements = Object.values(next).filter((p) => p.term === source.term);

  for (const p of sourceTermPlacements) {
    if (p.position >= source.position) {
      next[p.id] = { ...p, position: p.position - 1 };
    }
  }

  const targetTermPlacements = Object.values(next).filter((p) => p.term === target.term);

  let insertPos = dropLocation === 'before' ? target.position : target.position + 1;

  if (insertPos >= targetTermPlacements.length + 1 && source.term === target.term) {
    insertPos = target.position;
  }

  for (const p of targetTermPlacements) {
    if (p.position >= insertPos) {
      next[p.id] = { ...p, position: p.position + 1 };
    }
  }

  next[sourceId] = {
    ...next[sourceId],
    term: target.term,
    position: insertPos,
  };

  return next;
}

export function appendToTerm(
  placement: Placement,
  targetTerm: string,
  placements: Record<string, Placement>
) {
  const next = { ...placements };

  if (placement.term !== targetTerm) {
    const sourceTermPlacements = Object.values(next).filter((p) => p.term === placement.term);

    for (const p of sourceTermPlacements) {
      if (p.position >= placement.position) {
        next[p.id] = { ...p, position: p.position - 1 };
      }
    }
  }

  const targetTermPlacements = Object.values(next).filter((p) => p.term === targetTerm);

  next[placement.id] = {
    ...placement,
    term: targetTerm,
    position: targetTermPlacements.length + 1,
  };

  return next;
}
