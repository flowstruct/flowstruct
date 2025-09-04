import { StudyPlanSummary } from '@/features/study-plan/types.ts';
import { Program } from '@/features/program/types.ts';
import { getProgramDisplayName } from '@/utils/getProgramDisplayName.ts';

export const getStudyPlanRows = (studyPlans: StudyPlanSummary[], programs: Program[]) => {
  return studyPlans.map((studyPlan) => {
    const program = programs.find((p) => p.id === studyPlan.program);
    return {
      ...studyPlan,
      programName: program ? getProgramDisplayName(program) : 'Undefined',
    };
  });
};
