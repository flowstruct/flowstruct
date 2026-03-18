import type { Flowsheet } from '../types';

export type Requisites = {
  prerequisites: Set<number>;
  corequisites: Set<number>;
  prerequisiteSequence: Set<number>;
  postrequisiteSequence: Set<number>;
};

function traversePrerequisites(
  course: number,
  visited: Set<number>,
  graph: Map<number, Requisites>,
  prerequisitesByCourse: Map<number, Flowsheet['coursePrerequisites']>,
  corequisitesByCourse: Map<number, Flowsheet['courseCorequisites']>
) {
  const courseSequences = graph.get(course)!;
  const coursePrerequisites = prerequisitesByCourse.get(course);
  const courseCorequisites = corequisitesByCourse.get(course);

  courseCorequisites?.forEach((cc) => {
    const corequisite = cc.corequisite;
    courseSequences.corequisites.add(corequisite);
  });

  if (!coursePrerequisites) {
    visited.add(course);
    return;
  }

  for (const cp of coursePrerequisites) {
    const prerequisite = cp.prerequisite;
    if (!graph.has(prerequisite)) continue;

    if (!visited.has(prerequisite)) {
      traversePrerequisites(
        prerequisite,
        visited,
        graph,
        prerequisitesByCourse,
        corequisitesByCourse
      );
    }

    const prerequisiteCourseSequences = graph.get(prerequisite)!;

    courseSequences.prerequisites.add(prerequisite);

    prerequisiteCourseSequences.prerequisiteSequence.forEach((id) =>
      courseSequences.prerequisiteSequence.add(id)
    );
    courseSequences.prerequisiteSequence.add(prerequisite);

    prerequisiteCourseSequences.postrequisiteSequence.add(course);
  }

  visited.add(course);
}

function traversePostrequisites(
  course: number,
  visited: Set<number>,
  graph: Map<number, Requisites>
) {
  const courseSequences = graph.get(course)!;
  const postrequisites = courseSequences.postrequisiteSequence;

  for (const p of postrequisites) {
    if (!graph.has(p)) continue;

    if (!visited.has(p)) {
      traversePostrequisites(p, visited, graph);
    }

    const postrequisiteCourseSequences = graph.get(p)!;

    courseSequences.postrequisiteSequence.add(p);
    postrequisiteCourseSequences.postrequisiteSequence.forEach((id) =>
      courseSequences.postrequisiteSequence.add(id)
    );
  }

  visited.add(course);
}

export function createCoursesGraph(flowsheet: Flowsheet): Map<number, Requisites> {
  const courses = flowsheet.terms.flatMap((t) => t.placements.map((p) => p.course));

  const prerequisitesByCourse = Map.groupBy(flowsheet.coursePrerequisites, (cp) => cp.course);
  const corequisitesByCourse = Map.groupBy(flowsheet.courseCorequisites, (cc) => cc.course);

  const visitedPrerequisites = new Set<number>();
  const visitedPostrequisites = new Set<number>();
  const graph = new Map<number, Requisites>();

  courses.forEach((course) => {
    graph.set(course, {
      prerequisites: new Set(),
      corequisites: new Set(),
      prerequisiteSequence: new Set(),
      postrequisiteSequence: new Set(),
    });
  });

  courses.forEach((c) => {
    if (!visitedPrerequisites.has(c)) {
      traversePrerequisites(
        c,
        visitedPrerequisites,
        graph,
        prerequisitesByCourse,
        corequisitesByCourse
      );
    }
  });

  courses.forEach((c) => {
    if (!visitedPostrequisites.has(c)) {
      traversePostrequisites(c, visitedPostrequisites, graph);
    }
  });

  return graph;
}
