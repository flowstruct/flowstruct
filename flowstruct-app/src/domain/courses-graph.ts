import type { Flowsheet } from './flowsheet.ts';

export type Requisites = {
  prerequisites: Set<string>;
  corequisites: Set<string>;
  prerequisiteSequence: Set<string>;
  postrequisiteSequence: Set<string>;
};

const traversePrerequisites = (
  course: string,
  visited: Set<string>,
  graph: Map<string, Requisites>,
  flowsheet: Flowsheet
) => {
  const courseMeta = flowsheet.courses[course];
  if (!courseMeta) return;

  const courseSequences = graph.get(course)!;
  const prerequisites = courseMeta.prerequisites;

  if (!prerequisites) {
    visited.add(course);
    return;
  }

  for (const p of prerequisites) {
    if (!graph.has(p)) continue;

    if (!visited.has(p)) {
      traversePrerequisites(p, visited, graph, flowsheet);
    }

    const prerequisiteCourseSequences = graph.get(p)!;

    courseSequences.prerequisites.add(p);

    prerequisiteCourseSequences.prerequisiteSequence.forEach((id) =>
      courseSequences.prerequisiteSequence.add(id)
    );
    courseSequences.prerequisiteSequence.add(p);

    prerequisiteCourseSequences.postrequisiteSequence.add(course);
  }

  visited.add(course);
};

const traversePostrequisites = (
  course: string,
  visited: Set<string>,
  graph: Map<string, Requisites>
) => {
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
};

export const buildCoursesGraph = (flowsheet: Flowsheet): Map<string, Requisites> => {
  const visitedPrerequisites = new Set<string>();
  const visitedPostrequisites = new Set<string>();
  const graph = new Map<string, Requisites>();
  const allCourses = Object.values(flowsheet.courses);

  allCourses.forEach((course) => {
    graph.set(course.id, {
      prerequisites: new Set(),
      corequisites: new Set(),
      prerequisiteSequence: new Set(),
      postrequisiteSequence: new Set(),
    });
  });

  allCourses.forEach((c) => {
    if (!visitedPrerequisites.has(c.id)) {
      traversePrerequisites(c.id, visitedPrerequisites, graph, flowsheet);
    }
  });

  allCourses.forEach((c) => {
    if (!visitedPostrequisites.has(c.id)) {
      traversePostrequisites(c.id, visitedPostrequisites, graph);
    }
  });

  return graph;
};
