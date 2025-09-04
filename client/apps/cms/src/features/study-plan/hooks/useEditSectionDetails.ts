import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { Section, StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

const editSectionDetails = ({
  sectionDetails,
  sectionId,
  studyPlanId,
}: {
  sectionDetails: Partial<Section>;
  sectionId: number;
  studyPlanId: number;
}) =>
  api.put<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'sections', sectionId], {
    body: sectionDetails,
  });

export const useEditSectionDetails = () =>
  useAppMutation({
    mutationFn: editSectionDetails,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
      successMessage: 'Section details updated.',
    },
  });
