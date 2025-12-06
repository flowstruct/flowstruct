import { Requisites } from "@/features/flowsheet/contexts/courses-graph-context";

export type CourseRelation = 'SELF' | 'PREREQ' | 'PREREQSEQ' | 'COREQ' | 'POSTREQSEQ' | 'UNRELATED';

export function classifyRelationship(
  sourceId: number,
  targetId: number,
  graph: Map<number, Requisites>
): CourseRelation {
  if (sourceId === targetId) return 'SELF';

  const source = graph.get(sourceId);
  if (!source) return 'UNRELATED';

  if (source.prerequisites.has(targetId)) return 'PREREQ';
  if (source.prerequisiteSequence.has(targetId)) return 'PREREQSEQ';
  if (source.corequisites.has(targetId)) return 'COREQ';
  if (source.postrequisiteSequence.has(targetId)) return 'POSTREQSEQ';

  return 'UNRELATED';
}
