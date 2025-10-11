import { Flowsheet } from '@/features/flowsheet/domain/flowsheet.ts';
import { CourseSummary } from '@/features/course/domain/course.ts';
import React, { useContext } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';

type FlowsheetContextValues = {
  flowsheet: Flowsheet;
  flowsheetCourses: { list: CourseSummary[]; byIds: Record<number, CourseSummary> };
};

const FlowsheetContext = React.createContext<FlowsheetContextValues | undefined>(undefined);

type FlowsheetProviderProps = {
  flowsheetId: number;
  children: React.ReactNode;
};

export function FlowsheetProvider({ flowsheetId, children }: FlowsheetProviderProps) {
  const { data: flowsheet } = useSuspenseQuery(flowsheetQueries.detail(flowsheetId));
  const { data: flowsheetCourses } = useSuspenseQuery(
    flowsheetQueries.courseCollection(flowsheetId)
  );

  return (
    <FlowsheetContext.Provider value={{ flowsheet, flowsheetCourses }}>
      {children}
    </FlowsheetContext.Provider>
  );
}

export const useFlowsheetContext = () => {
  const context = useContext(FlowsheetContext);

  if (!context) {
    throw new Error('useFlowsheetContext must be used within FlowsheetProvider.');
  }

  return context;
};
