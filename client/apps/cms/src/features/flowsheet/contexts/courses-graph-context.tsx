import React, { ReactNode, useMemo } from 'react';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';

type FlowsheetCoursesGraphContextType = {
  coursesGraph: Map<number, Requisites>;
};

export type Requisites = {
  prerequisites: Set<number>;
  corequisites: Set<number>;
  prerequisiteSequence: Set<number>;
  postrequisiteSequence: Set<number>;
};

const FlowsheetCoursesGraphContext = React.createContext<
  FlowsheetCoursesGraphContextType | undefined
>(undefined);

function FlowsheetCoursesGraphProvider({ children }: { children: ReactNode }) {
  const { flowsheet } = useFlowsheetContext();

  const coursesGraph = useMemo(() => {
    if (!flowsheet) return new Map<number, Requisites>();

    const prerequisitesByCourse = Map.groupBy(flowsheet.coursePrerequisites, (cp) => cp.course);
    const corequisitesByCourse = Map.groupBy(flowsheet.courseCorequisites, (cc) => cc.course);

    const traversePrerequisites = (
      course: number,
      visited: Set<number>,
      graph: Map<number, Requisites>
    ) => {
      const courseSequences = graph.get(course)!;
      const coursePrerequisites = prerequisitesByCourse.get(course);
      const courseCorequisites = corequisitesByCourse.get(course);

      if (!coursePrerequisites) {
        visited.add(course);
        return;
      }

      courseCorequisites?.forEach((cc) => {
        const corequisite = cc.corequisite;
        courseSequences.corequisites.add(corequisite);
      });

      for (const cp of coursePrerequisites) {
        const prerequisite = cp.prerequisite;
        if (!graph.has(prerequisite)) continue;

        if (!visited.has(prerequisite)) {
          traversePrerequisites(prerequisite, visited, graph);
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
    };

    const traversePostrequisites = (
      course: number,
      visited: Set<number>,
      graph: Map<number, Requisites>
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

    const buildCoursesGraph = (courses: number[]): Map<number, Requisites> => {
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
          traversePrerequisites(c, visitedPrerequisites, graph);
        }
      });

      courses.forEach((c) => {
        if (!visitedPostrequisites.has(c)) {
          traversePostrequisites(c, visitedPostrequisites, graph);
        }
      });

      return graph;
    };

    return buildCoursesGraph(flowsheet.sections.flatMap((section) => section.courses));
  }, [flowsheet]);

  return (
    <FlowsheetCoursesGraphContext.Provider value={{ coursesGraph }}>
      {children}
    </FlowsheetCoursesGraphContext.Provider>
  );
}

const useFlowsheetCoursesGraphContext = () => {
  const context = React.useContext(FlowsheetCoursesGraphContext);
  if (!context) {
    throw new Error(
      'useFlowsheetCoursesGraphContext must be used within a FlowsheetCoursesGraphProvider'
    );
  }
  return context;
};

export { FlowsheetCoursesGraphProvider, useFlowsheetCoursesGraphContext };
