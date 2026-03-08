import { Flowsheet } from '@/features/flowsheet/domain/flowsheet';

export const getFlowsheetDisplayName = (studyPlan: Pick<Flowsheet, 'year' | 'name'>) =>
  `${studyPlan?.year}/${studyPlan?.year + 1} ${studyPlan?.name ?? ''}`;
