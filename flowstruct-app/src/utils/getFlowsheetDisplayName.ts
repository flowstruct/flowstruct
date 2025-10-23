import { Flowsheet } from '@/features/flowsheet/domain/flowsheet.ts';

export const getFlowsheetDisplayName = (studyPlan: Pick<Flowsheet, 'year' | 'name'>) =>
  `${studyPlan?.year}/${studyPlan?.year + 1} ${studyPlan?.name ?? ''}`;
