import { CourseRelation, CourseSequences, StudyPlan } from '../types';

const traversePrerequisites = (
  courseId: number,
  coursePrerequisitesMap: Record<number, Record<number, CourseRelation>>,
  visited: Set<number>,
  graph: Map<number, CourseSequences>
) => {
  const prerequisites = coursePrerequisitesMap[courseId];
  if (!prerequisites) return;

  for (const prereq in prerequisites) {
    const prereqId = Number(prereq);

    if (!visited.has(prereqId)) {
      traversePrerequisites(prereqId, coursePrerequisitesMap, visited, graph);
    }

    const currentSeq = graph.get(courseId)!;
    const prereqSeq = graph.get(prereqId)!;

    prereqSeq.prerequisiteSequence.forEach((id) => currentSeq.prerequisiteSequence.add(id));
    currentSeq.prerequisiteSequence.add(prereqId);

    prereqSeq.postrequisiteSequence.add(courseId);
  }
  visited.add(courseId);
};

const traversePostrequisites = (
  courseId: number,
  visited: Set<number>,
  graph: Map<number, CourseSequences>
) => {
  const currentSeq = graph.get(courseId)!;
  const postCourses = new Set(currentSeq.postrequisiteSequence);

  for (const postId of postCourses) {
    if (!visited.has(postId)) {
      traversePostrequisites(postId, visited, graph);
    }

    const postSeq = graph.get(postId)!;

    currentSeq.postrequisiteSequence.add(postId);
    postSeq.postrequisiteSequence.forEach((id) => currentSeq.postrequisiteSequence.add(id));
  }
  visited.add(courseId);
};

export const buildCoursesGraph = (studyPlan: StudyPlan): Map<number, CourseSequences> => {
  const courses = studyPlan.sections.flatMap((section) => section.courses);

  const visitedPrereq = new Set<number>();
  const visitedPostreq = new Set<number>();
  const graph = new Map<number, CourseSequences>();

  courses.forEach((courseId) => {
    graph.set(courseId, { prerequisiteSequence: new Set(), postrequisiteSequence: new Set() });
  });

  courses.forEach((courseId) => {
    if (!visitedPrereq.has(courseId)) {
      traversePrerequisites(courseId, studyPlan.coursePrerequisites, visitedPrereq, graph);
    }
  });

  courses.forEach((courseId) => {
    if (!visitedPostreq.has(courseId)) {
      traversePostrequisites(courseId, visitedPostreq, graph);
    }
  });

  return graph;
};
