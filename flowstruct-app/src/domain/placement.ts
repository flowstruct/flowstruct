import type { Flowsheet } from './flowsheet.ts';

type DeletePlacementsArgs = {
  flowsheet: Flowsheet;
  placementIds: string[];
};

export const deletePlacements = ({
  courses,
  terms,
  placementIds,
}: DeletePlacementsArgs): Flowsheet => {
  const placementIdsSet = new Set(placementIds);

  const updatedCourses = { ...courses };

  const updatedTerms = terms.map((term) => {
    const updatedPlacements = term.placements.filter((p) => {
      if (!placementIdsSet.has(p.id)) return true;

      if (p.type === 'COURSE') {
        delete updatedCourses[p.course];
      }
      // handle elective slot deletion
      return false;
    });

    return { ...term, placements: updatedPlacements };
  });

  return {
    terms: updatedTerms,
    courses: updatedCourses,
  };
};
