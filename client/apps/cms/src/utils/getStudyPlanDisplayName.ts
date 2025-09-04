import { StudyPlan } from '@/features/study-plan/types.ts';

export const getStudyPlanDisplayName = (studyPlan: Pick<StudyPlan, 'year' | 'track'>) =>
  `${studyPlan?.year}/${studyPlan?.year + 1} ${studyPlan?.track ?? ''}`;
