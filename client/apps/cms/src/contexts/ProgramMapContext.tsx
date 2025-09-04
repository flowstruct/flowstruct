import React, { DragEvent, ReactNode, useCallback, useMemo } from 'react';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { useCoursesGraph } from '@/contexts/CoursesGraphContext.tsx';
import { getTermIndexFromPlacement } from '@/utils/getTermIndexFromPlacement.ts';
import { comparePlacement } from '@/utils/comparePlacement.ts';
import { CoursePlacement } from '@/features/study-plan/types.ts';
import { getPlacementFromTermIndex } from '@/utils/getPlacementFromTermIndex';
import classes from '@/features/study-plan/styles/ProgramMap.module.css';
import { useMoveCourseToSemester } from '@/features/study-plan/hooks/useMoveCourseToSemester.ts';

type DragHandlers = {
  onDragStart: (e: DragEvent<HTMLDivElement>, courseId: number) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
};

type ProgramMapContextType = {
  movingCourse: number | null;
  moveCourse: (courseId: number | null) => void;
  isPlacementAllowed: (placement: Pick<CoursePlacement, 'year' | 'semester'>) => boolean;
  dragHandlers: DragHandlers;
};

const ProgramMapContext = React.createContext<ProgramMapContextType | undefined>(undefined);

function ProgramMapProvider({ children }: { children: ReactNode }) {
  const [movingCourse, setMovingCourse] = React.useState<number | null>(null);
  const { data: studyPlan } = useCurrentStudyPlan();
  const { coursesGraph } = useCoursesGraph();

  const moveCourseToSemester = useMoveCourseToSemester();

  const SEMESTERS_PER_YEAR = 3;

  const moveCourse = useCallback((courseId: number | null) => {
    setMovingCourse((prev) => (prev === courseId ? null : courseId));
  }, []);

  const clearAllIndicators = useCallback(() => {
    const indicators = document.querySelectorAll(`.${classes.dropIndicator}`);
    indicators.forEach((indicator) => {
      (indicator as HTMLElement).style.opacity = '0';
    });
  }, []);

  const getNearestIndicator = useCallback((e: DragEvent<HTMLDivElement>) => {
    const indicators = document.querySelectorAll(`.${classes.dropIndicator}`);

    let closest: {
      distance: number;
      element: Element | null;
    } = {
      distance: Infinity,
      element: null,
    };

    indicators.forEach((indicator) => {
      const rect = indicator.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      if (distance < closest.distance) {
        closest = {
          distance,
          element: indicator,
        };
      }
    });

    return closest.element as HTMLDivElement | null;
  }, []);

  const dragHandlers: DragHandlers = useMemo(
    () => ({
      onDragStart: (e: DragEvent<HTMLDivElement>, courseId: number) => {
        e.dataTransfer.setData('courseId', String(courseId));
        moveCourse(courseId);
      },

      onDragEnd: (e: DragEvent<HTMLDivElement>) => {
        clearAllIndicators();

        if (!movingCourse) return;

        const nearestIndicator = getNearestIndicator(e);

        if (!nearestIndicator) {
          setMovingCourse(null);
          return;
        }

        const targetPlacement = JSON.parse(
          nearestIndicator.dataset.placement ?? ''
        ) as CoursePlacement | null;
        const oldPlacement = studyPlan.coursePlacements[movingCourse];

        if (!targetPlacement || !oldPlacement) {
          setMovingCourse(null);
          return;
        }

        const isSamePlacement = comparePlacement(oldPlacement, targetPlacement) === 0;
        const positionDiff = targetPlacement.position - oldPlacement.position;

        if (isSamePlacement) {
          if (positionDiff === 0 || positionDiff === 1) {
            setMovingCourse(null);
            return;
          }

          if (positionDiff > 1) {
            targetPlacement.position -= 1;
          }
        }

        moveCourseToSemester.mutate({
          studyPlanId: studyPlan.id,
          courseId: movingCourse,
          targetPlacement: {
            ...oldPlacement,
            year: targetPlacement.year,
            semester: targetPlacement.semester,
            position: targetPlacement.position,
          },
        });

        setMovingCourse(null);
      },

      onDragOver: (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        clearAllIndicators();

        const nearestIndicator = getNearestIndicator(e);
        if (nearestIndicator) {
          (nearestIndicator as HTMLElement).style.opacity = '1';
        }
      },

      onDragLeave: (e: DragEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          clearAllIndicators();
        }
      },
    }),
    [
      moveCourse,
      clearAllIndicators,
      movingCourse,
      getNearestIndicator,
      studyPlan.coursePlacements,
      studyPlan.id,
      moveCourseToSemester,
    ]
  );

  const { minPlacement, maxPlacement } = useMemo(() => {
    if (!movingCourse || !coursesGraph || !studyPlan) {
      return { minPlacement: null, maxPlacement: null };
    }

    const requisites = coursesGraph.get(movingCourse);
    if (!requisites) {
      return { minPlacement: null, maxPlacement: null };
    }

    const prerequisitePlacements = Array.from(requisites.prerequisiteSequence ?? [])
      .map((pr) => studyPlan.coursePlacements[pr])
      .filter(Boolean);

    const postrequisitePlacements = Array.from(requisites.postrequisiteSequence ?? [])
      .map((pr) => studyPlan.coursePlacements[pr])
      .filter(Boolean);

    const prerequisiteTermIndexes = prerequisitePlacements.map((placement) =>
      getTermIndexFromPlacement(placement)
    );
    const postrequisiteTermIndexes = postrequisitePlacements.map((placement) =>
      getTermIndexFromPlacement(placement)
    );

    let minSemester = Math.max(...prerequisiteTermIndexes) + 1;
    let maxSemester = Math.min(...postrequisiteTermIndexes) - 1;

    if (!Number.isFinite(minSemester)) {
      minSemester = 0;
    }

    if (!Number.isFinite(maxSemester)) {
      maxSemester = studyPlan.duration * SEMESTERS_PER_YEAR;
    }

    return {
      minPlacement: getPlacementFromTermIndex(minSemester),
      maxPlacement: getPlacementFromTermIndex(maxSemester),
    };
  }, [movingCourse, coursesGraph, studyPlan]);

  const isPlacementAllowed = useCallback(
    (placement: Pick<CoursePlacement, 'year' | 'semester'>) => {
      if (!minPlacement || !maxPlacement) return false;
      return (
        comparePlacement(placement, minPlacement) >= 0 &&
        comparePlacement(placement, maxPlacement) <= 0
      );
    },
    [minPlacement, maxPlacement]
  );

  return (
    <ProgramMapContext.Provider
      value={{
        movingCourse,
        moveCourse,
        isPlacementAllowed,
        dragHandlers,
      }}
    >
      {children}
    </ProgramMapContext.Provider>
  );
}

const useProgramMap = () => {
  const context = React.useContext(ProgramMapContext);
  if (!context) throw new Error('useProgramMap hook must be used within ProgramMapProvider.');
  return context;
};

export { useProgramMap, ProgramMapContext, ProgramMapProvider };
