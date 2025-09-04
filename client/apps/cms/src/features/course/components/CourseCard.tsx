import { CourseSummary } from '@/features/course/types.ts';
import classes from '../styles/CourseCard.module.css';
import { ProgramMapCourseOptions } from '@/features/study-plan/components/ProgramMapCourseOptions.tsx';
import { useProgramMap } from '@/contexts/ProgramMapContext.tsx';
import { useCoursesGraph } from '@/contexts/CoursesGraphContext.tsx';
import { CoursePlacement } from '@/features/study-plan/types.ts';
import { DropIndicator } from '@/features/study-plan/components/DropIndicator.tsx';
import { useDisclosure } from '@mantine/hooks';
import { Popover, Text, Transition } from '@mantine/core';

type CourseCardProps = {
  course: CourseSummary;
  placement: CoursePlacement;
  missingPrerequisites: string[];
};

export function CourseCard({ course, placement, missingPrerequisites }: CourseCardProps) {
  const { movingCourse, isPlacementAllowed, dragHandlers } = useProgramMap();
  const { coursesGraph } = useCoursesGraph();
  const [opened, { close, open }] = useDisclosure(false);

  const getContainerClass = () => {
    if (movingCourse === course.id) return classes.moving;

    if (missingPrerequisites.length > 0) return classes.conflict;

    if (!movingCourse) return classes.container;

    const sequences = coursesGraph.get(movingCourse);
    if (!sequences) return classes.container;

    const isRelated =
      sequences.prerequisiteSequence.has(course.id) ||
      sequences.postrequisiteSequence.has(course.id);

    if (!isPlacementAllowed(placement)) {
      return isRelated ? classes.conflict : classes.disabled;
    }

    return classes.container;
  };

  return (
    <>
      <DropIndicator placement={placement} />
      <div className={classes.card}>
        <Transition mounted={missingPrerequisites.length > 0}>
          {(transitionStyles) => (
            <Popover withArrow shadow="md" position="top" opened={opened}>
              <Popover.Target>
                <div style={transitionStyles} className={classes.errorIndicator}>
                  !
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <Text fw={600} size="sm" c="red">
                  Prerequisites: <br />
                  {missingPrerequisites.map((code) => (
                    <li>{code}</li>
                  ))}
                </Text>
              </Popover.Dropdown>
            </Popover>
          )}
        </Transition>
        <div
          onMouseEnter={open}
          onMouseLeave={close}
          draggable
          onDragStart={(e) => dragHandlers.onDragStart(e, course.id)}
          onDragEnd={dragHandlers.onDragEnd}
          className={getContainerClass()}
        >
          <div className={classes.header}>
            <p className={classes.code}>{course.code}</p>
            <p className={classes.name}>{course.name}</p>
          </div>

          <div className={classes.optionsButton}>
            <ProgramMapCourseOptions course={course} placement={placement} />
          </div>

          <div className={classes.footer}>
            <p>{course.creditHours} Cr.</p>
            <p>{course.type}</p>
          </div>
        </div>
      </div>
    </>
  );
}
