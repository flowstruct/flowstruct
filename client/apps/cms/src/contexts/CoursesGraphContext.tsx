import React, { ReactNode, useMemo } from 'react';
import { CourseRelation } from '@/features/study-plan/types.ts';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';

type CoursesGraphContextType = {
  coursesGraph: Map<number, CourseRequisites>;
};

export type CourseRequisites = {
  prerequisiteSequence: Set<number>;
  postrequisiteSequence: Set<number>;
};

const CoursesGraphContext = React.createContext<CoursesGraphContextType | undefined>(undefined);

function CoursesGraphProvider({ children }: { children: ReactNode }) {
  const { data: studyPlan } = useCurrentStudyPlan();

  const coursesGraph = useMemo(() => {
    if (!studyPlan) return new Map<number, CourseRequisites>();

    const traversePrerequisites = (
      courseId: number,
      coursePrerequisitesMap: Record<number, Record<number, CourseRelation>>,
      visited: Set<number>,
      graph: Map<number, CourseRequisites>
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
      graph: Map<number, CourseRequisites>
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

    const buildCoursesGraph = (courses: number[]): Map<number, CourseRequisites> => {
      const visitedPrereq = new Set<number>();
      const visitedPostreq = new Set<number>();
      const graph = new Map<number, CourseRequisites>();

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

    return buildCoursesGraph(studyPlan.sections.flatMap((section) => section.courses));
  }, [studyPlan]);

  return (
    <CoursesGraphContext.Provider value={{ coursesGraph }}>{children}</CoursesGraphContext.Provider>
  );
}

const useCoursesGraph = () => {
  const context = React.useContext(CoursesGraphContext);
  if (!context) {
    throw new Error('useCoursesGraph must be used within a CoursesGraphProvider');
  }
  return context;
};

export { useCoursesGraph, CoursesGraphContext, CoursesGraphProvider };
