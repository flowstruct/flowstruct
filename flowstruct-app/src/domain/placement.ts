import type { Course } from './course.ts';
import type { Placement } from './flowsheet.ts';

type DeletePlacementsArgs = {
  courses: Record<string, Course>;
  placements: Placement[];
  placementIds: string[];
};

export const deletePlacements = ({
  courses,
  placements,
  placementIds,
}: DeletePlacementsArgs): Pick<DeletePlacementsArgs, 'courses' | 'placements'> => {
  const placementIdsSet = new Set(placementIds);

  const updatedCourses = { ...courses };

  const updatedPlacements = placements.filter((p) => {
    if (!placementIdsSet.has(p.id)) return true;

    if (p.type === 'COURSE') {
      delete updatedCourses[p.course];
    }
    // handle elective slot deletion
    return false;
  });

  return {
    courses: updatedCourses,
    placements: updatedPlacements,
  };
};
