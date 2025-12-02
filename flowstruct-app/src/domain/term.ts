import type { Requisites } from "./courses-graph";
import type { Placement, Term } from "./flowsheet";

export function calculateAllowedTerms(
  courseId: string,
  terms: Record<string, Term>,
  graph: Map<string, Requisites>,
  placements: Record<string, Placement>
) {
  const requisites = graph.get(courseId);
  if (!requisites) return new Set(Object.keys(terms));

  const placementsByItem = Object.values(placements).reduce((acc, placement) => {
    if (placement.type === 'COURSE') {
      acc[placement.item] = placement;
    }
    return acc;
  }, {} as Record<string, Placement>);

  const prerequisitePositions = Array.from(requisites.prerequisites)
    .map(prereqId => placementsByItem[prereqId])
    .filter(Boolean)
    .map(placement => terms[placement.term]?.position)
    .filter((pos): pos is number => pos !== undefined);

  const maxPrereqPosition = prerequisitePositions.length > 0
    ? Math.max(...prerequisitePositions)
    : -Infinity;

  const postrequisitePositions = Array.from(requisites.postrequisiteSequence)
    .map(postreqId => placementsByItem[postreqId])
    .filter(Boolean)
    .map(placement => terms[placement.term]?.position)
    .filter((pos): pos is number => pos !== undefined);

  const minPostreqPosition = postrequisitePositions.length > 0
    ? Math.min(...postrequisitePositions)
    : Infinity;

  const allowedTerms = new Set(
    Object.values(terms)
      .filter(term => term.position > maxPrereqPosition && term.position < minPostreqPosition)
      .map(term => term.id)
  );

  return allowedTerms;
}
