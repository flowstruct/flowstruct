import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { flowsheetQueries } from '@/features/flowsheet/queries';
import { Header } from '@/shared/components/header';
import {
  FlowsheetProvider,
  useFlowsheetContext,
} from '@/features/flowsheet/contexts/flowsheet-context';
import { FlowsheetGrid } from '@/features/flowsheet/components/flowsheet-grid/flowsheet-grid';
import styles from './$flowsheetId.module.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import { Dot, Layers2 } from 'lucide-react';
import { FlowsheetStatusIcon } from '@/features/flowsheet/components/flowsheet-status-icon';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName';
import { getFlowsheetDisplayName } from '@/features/flowsheet/domain/getFlowsheetDisplayName';
import { FlowsheetGridProvider } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import Group from '@/shared/components/layout/group';
import { FlowsheetCoursesGraphProvider } from '@/features/flowsheet/contexts/courses-graph-context';
import { PlacementMoveProvider } from '@/features/flowsheet/contexts/placement-move-context';

export const Route = createFileRoute('/_app/flowsheets/$flowsheetId')({
  loader: ({ context: { queryClient }, params: { flowsheetId } }) => {
    queryClient.ensureQueryData(flowsheetQueries.detail(Number(flowsheetId)));
    queryClient.ensureQueryData(flowsheetQueries.courseCollection(Number(flowsheetId)));
  },
  component: () => {
    const { flowsheetId } = Route.useParams();

    return (
      <FlowsheetProvider flowsheetId={Number(flowsheetId)}>
        <FlowsheetCoursesGraphProvider>
          <RouteHeader />
          <div className={styles.content}>
            <FlowsheetGridProvider>
              <PlacementMoveProvider>
                <FlowsheetGrid />
              </PlacementMoveProvider>
            </FlowsheetGridProvider>
          </div>
        </FlowsheetCoursesGraphProvider>
      </FlowsheetProvider>
    );
  },
});

function RouteHeader() {
  return (
    <Header>
      <Group>
        <RouteBreadcrumbs />
      </Group>
    </Header>
  );
}

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
