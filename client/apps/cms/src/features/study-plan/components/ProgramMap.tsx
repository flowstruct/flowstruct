import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { useCurrentStudyPlanCourses } from '@/features/study-plan/hooks/useCurrentStudyPlanCourses.ts';
import { useProgramMap } from '@/contexts/ProgramMapContext.tsx';
import classes from '../styles/ProgramMap.module.css';
import { CourseCard } from '@/features/course/components/CourseCard.tsx';
import { CoursePlacementMultiSelect } from '@/features/study-plan/components/CoursePlacementMultiSelect.tsx';
import { getPlacementFromTermIndex } from '@/utils/getPlacementFromTermIndex.ts';
import { DropIndicator } from '@/features/study-plan/components/DropIndicator.tsx';
import { createCourseGridCellMap } from '@/utils/createCourseGridCellMap.ts';
import React from 'react';
import { CoursePlacement } from '@/features/study-plan/types.ts';
import { comparePlacement } from '@/utils/comparePlacement.ts';
import { Button, Paper, Stack, Text, Title, ScrollArea } from '@mantine/core';
import { BookOpen, BookPlus, MoveLeft, MoveRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { DefaultFrameworkCoursesSearchValues } from '@/utils/defaultFrameworkCoursesSearchValues.ts';

export function ProgramMap() {
  const { data: studyPlan } = useCurrentStudyPlan();
  const { data: courses } = useCurrentStudyPlanCourses();
  const { dragHandlers } = useProgramMap();

  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const SCROLL_AMOUNT = 600;

  const semesterTypes = ['First', 'Second', 'Summer'] as const;
  const SEMESTERS_PER_YEAR = 3;

  const { courseGridMap, gridWidth, gridHeight, coursesByTermIndex, columnHeights } = React.useMemo(
    () => createCourseGridCellMap(studyPlan),
    [studyPlan]
  );

  const totalCredits = new Map<number, number>();
  Array.from(coursesByTermIndex.keys()).forEach((termIndex) => {
    const sum = coursesByTermIndex
      .get(termIndex)!
      .reduce((acc, id) => acc + (courses[id]?.creditHours || 0), 0);
    totalCredits.set(termIndex, sum);
  });

  const scroll = (amount: number) => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: amount,
        behavior: 'smooth',
      });
    }
  };

  if (studyPlan.sections.flatMap((s) => s.courses).length === 0) {
    return (
      <Paper withBorder p="xl">
        <Stack align="center" gap="xs">
          <BookPlus size={32} />
          <Title order={2} fw={600}>
            Add Courses
          </Title>
          <Text mb="md" c="dimmed" size="sm">
            Add courses to the study plan first before placing them here
          </Text>

          <Link
            params={{ studyPlanId: String(studyPlan.id) }}
            to="/study-plans/$studyPlanId/courses"
            search={DefaultFrameworkCoursesSearchValues()}
          >
            <Button variant="outline" leftSection={<BookOpen size={18} />}>
              Go to Courses
            </Button>
          </Link>
        </Stack>
      </Paper>
    );
  }

  return (
    <div className={classes.programMapContainer}>
      <div className={classes.navigationContainer}>
        <Button
          style={{ boxShadow: 'var(--mantine-shadow-sm)' }}
          variant="default"
          size="compact-sm"
          onClick={() => scroll(-SCROLL_AMOUNT)}
          w={150}
        >
          <MoveLeft size={18} />
        </Button>

        <Button
          style={{ boxShadow: 'var(--mantine-shadow-sm)' }}
          variant="default"
          size="compact-sm"
          onClick={() => scroll(SCROLL_AMOUNT)}
          w={150}
        >
          <MoveRight size={18} />
        </Button>
      </div>

      <ScrollArea scrollbarSize={5} viewportRef={scrollableRef} className={classes.gridContainer}>
        <div className={classes.wrapper}>
          <div className={classes.headerGridContainer}>
            <div
              className={classes.headerGrid}
              style={{
                gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
              }}
            >
              {Array.from({ length: studyPlan.duration }, (_, yearIndex) => {
                const year = studyPlan.year + yearIndex;

                return (
                  <div
                    key={`year-${yearIndex + 1}`}
                    className={`${classes.headerCell} ${classes.yearHeader}`}
                    style={{
                      gridColumn: `span ${SEMESTERS_PER_YEAR}`,
                    }}
                  >
                    {year} / {year + 1}
                  </div>
                );
              })}

              {Array.from(coursesByTermIndex.keys()).map((termIndex) => {
                const semester = semesterTypes[getPlacementFromTermIndex(termIndex).semester - 1];

                return (
                  <div
                    key={`semester-${termIndex}`}
                    className={`${classes.headerCell} ${classes.semesterHeader}`}
                    style={{
                      gridColumn: termIndex + 1,
                    }}
                  >
                    {semester} - {totalCredits.get(termIndex)} Cr.
                  </div>
                );
              })}
            </div>
          </div>

          <div
            onDragOver={dragHandlers.onDragOver}
            onDragLeave={dragHandlers.onDragLeave}
            className={classes.programMap}
            style={{
              gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
              gridTemplateRows: `repeat(${gridHeight}, 1fr)`,
            }}
          >
            {Array.from(courseGridMap.entries()).map(([courseId, gridCell]) => {
              const course = courses[courseId];
              if (!course) return null;

              const placement = studyPlan.coursePlacements[course.id];
              const prerequisites = studyPlan.coursePrerequisites[courseId] ?? {};

              const unmetPrerequisite = (prerequisiteId: string) => {
                const prerequisitePlacement = studyPlan.coursePlacements[Number(prerequisiteId)];
                return (
                  prerequisitePlacement === undefined ||
                  comparePlacement(placement, prerequisitePlacement) <= 0
                );
              };

              const missingPrerequisites = Object.keys(prerequisites)
                .filter(unmetPrerequisite)
                .map((prerequisiteId) => courses[Number(prerequisiteId)].code);

              return (
                <div
                  key={courseId}
                  className={classes.cell}
                  style={{
                    gridColumn: gridCell.column,
                    gridRow: `${gridCell.row} / span ${gridCell.span}`,
                  }}
                >
                  <CourseCard
                    course={course}
                    placement={placement}
                    missingPrerequisites={missingPrerequisites}
                  />
                </div>
              );
            })}

            {Array.from(coursesByTermIndex.entries()).map(([termIndex, termCourses]) => {
              const placement = {
                ...getPlacementFromTermIndex(termIndex),
                position: termCourses.length + 1,
                span: 1,
              } as CoursePlacement;
              const columnHeight = columnHeights.get(termIndex) || 1;

              return (
                <div
                  key={`drop-${termIndex}`}
                  className={classes.cell}
                  style={{
                    gridColumn: termIndex + 1,
                    gridRow: columnHeight,
                  }}
                >
                  <DropIndicator placement={placement} />
                  <CoursePlacementMultiSelect placement={placement} />
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
