import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { Header, HeaderMain } from '@/shared/components/header.tsx';
import {
  FlowsheetProvider,
  useFlowsheetContext,
} from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { FlowsheetGrid } from '@/features/flowsheet/components/flowsheet-grid/flowsheet-grid.tsx';
import styles from './$flowsheetId.module.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs.tsx';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton.tsx';
import { Dot, Layers2 } from 'lucide-react';
import { FlowsheetStatusIcon } from '@/features/flowsheet/components/flowsheet-status-icon.tsx';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { getFlowsheetDisplayName } from '@/features/flowsheet/domain/getFlowsheetDisplayName.ts';

export const Route = createFileRoute('/_app/flowsheets/$flowsheetId')({
  loader: ({ context: { queryClient }, params: { flowsheetId } }) => {
    queryClient.ensureQueryData(flowsheetQueries.detail(Number(flowsheetId)));
    queryClient.ensureQueryData(flowsheetQueries.courseCollection(Number(flowsheetId)));
  },
  component: () => {
    const { flowsheetId } = Route.useParams();

    return (
      <FlowsheetProvider flowsheetId={Number(flowsheetId)}>
        <Header>
          <HeaderMain>
            <RouteBreadcrumbs />
          </HeaderMain>
        </Header>

        <div className={styles.content}>
          <FlowsheetGrid />
        </div>
      </FlowsheetProvider>
    );
  },
});

export function RouteBreadcrumbs() {
  const { flowsheet } = useFlowsheetContext();
  const { data: programs } = useSuspenseQuery(programQueries.collection);
  const navigate = useNavigate();

  const program = programs.byIds[flowsheet.program];
  if (!program) return;

  return (
    <Breadcrumbs>
      <UnstyledButton onPress={() => navigate({ to: '/flowsheets', search: { tab: 'active' } })}>
        <Breadcrumb base>
          <Layers2 size={14} /> Flowsheets
        </Breadcrumb>
      </UnstyledButton>

      <Breadcrumb>
        <FlowsheetStatusIcon flowsheet={flowsheet} />

        <p className={styles.flowsheetBreadcrumb}>
          {getProgramDisplayName(program)}

          <span className={styles.flowsheetMeta}>
            <Dot className={styles.flowsheetMeta} />
            {getFlowsheetDisplayName(flowsheet)}
          </span>
        </p>
      </Breadcrumb>
    </Breadcrumbs>
  );
}
