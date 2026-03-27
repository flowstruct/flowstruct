import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { flowsheetQueries } from '@/features/flowsheet/queries';
import { Header, HeaderMain } from '@/shared/components/header';
import {
  FlowsheetProvider,
  useFlowsheetContext,
} from '@/features/flowsheet/contexts/flowsheet-context';
import { FlowsheetGrid } from '@/features/flowsheet/components/flowsheet-grid/flowsheet-grid';
import styles from './$flowsheetId.module.css';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries';
import { userQueries } from '@/features/user/queries';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import { Dot, Layers2, Archive, MoveLeft, MoveRight, CircleCheck, Undo } from 'lucide-react';
import { FlowsheetStatusIcon } from '@/features/flowsheet/components/flowsheet-status-icon';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName';
import { getFlowsheetDisplayName } from '@/features/flowsheet/domain/getFlowsheetDisplayName';
import { FlowsheetGridProvider } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import Group from '@/shared/components/layout/group';
import { FlowsheetCoursesGraphProvider } from '@/features/flowsheet/contexts/courses-graph-context';
import { PlacementMoveProvider } from '@/features/flowsheet/contexts/placement-move-context';
import { FlowsheetActionsMenu } from '@/features/flowsheet/components/flowsheet-action-menu';
import { formatDate } from '@/shared/utils/formatDate';
import { usePermission } from '@/features/user/hooks/usePermission';
import { flowsheetApi } from '@/features/flowsheet/api';
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';
import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import {
  ConfirmationModal,
  ConfirmationModalTrigger,
} from '@/shared/components/confirmation-modal';

export const Route = createFileRoute('/_app/flowsheets/$flowsheetId')({
  loader: ({ context: { queryClient }, params: { flowsheetId } }) => {
    queryClient.ensureQueryData(flowsheetQueries.detail(Number(flowsheetId)));
    queryClient.ensureQueryData(flowsheetQueries.courseCollection(Number(flowsheetId)));
    queryClient.ensureQueryData(userQueries.collection);
  },
  component: () => {
    const { flowsheetId } = Route.useParams();
    const gridContainerRef = React.useRef<HTMLDivElement>(null);

    return (
      <FlowsheetProvider flowsheetId={Number(flowsheetId)}>
        <FlowsheetCoursesGraphProvider>
          <RouteHeader />
          <div className={styles.content}>
            <ArchiveAlert />
            <GridNavigation scrollableRef={gridContainerRef} />
            <div className={styles.grid} ref={gridContainerRef}>
              <FlowsheetGridProvider>
                <PlacementMoveProvider>
                  <FlowsheetGrid />
                </PlacementMoveProvider>
              </FlowsheetGridProvider>
            </div>
          </div>
        </FlowsheetCoursesGraphProvider>
      </FlowsheetProvider>
    );
  },
});

function GridNavigation({ scrollableRef }: { scrollableRef: React.RefObject<HTMLDivElement> }) {
  const SCROLL_AMOUNT = 400;

  const scroll = (amount: number) => {
    scrollableRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <Group justify="center" className={styles.gridNavigation}>
      <UnstyledButton className={styles.navigationButton} onPress={() => scroll(-SCROLL_AMOUNT)}>
        <MoveLeft size={18} />
      </UnstyledButton>

      <UnstyledButton className={styles.navigationButton} onPress={() => scroll(SCROLL_AMOUNT)}>
        <MoveRight size={18} />
      </UnstyledButton>
    </Group>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={styles.statusBadge} data-status={status}>
      {status}
    </span>
  );
}

function FlowsheetStatusActions({ flowsheet }: { flowsheet: FlowsheetSummary }) {
  const { hasPermission } = usePermission();

  const approveChanges = useMutation({
    mutationFn: () => flowsheetApi.approveChanges(flowsheet.id),
    meta: { successMessage: 'Changes approved.' },
  });

  const discardChanges = useMutation({
    mutationFn: () => flowsheetApi.discardChanges(flowsheet.id),
    meta: { successMessage: 'Changes discarded.' },
  });

  if (flowsheet.status === 'APPROVED') return null;

  const canApprove = hasPermission?.('study-plans:approve');

  return (
    <Group>
      {canApprove && (
        <>
          <ConfirmationModal
            header="Approve changes"
            text="These changes will be included in future site generations. Are you sure you want to proceed?"
            submitLabel="Approve"
            submitIcon={<CircleCheck size={15} />}
            onConfirm={() => approveChanges.mutate()}
          >
            <ConfirmationModalTrigger>
              <Button size="sm" variant="primary">
                <CircleCheck size={15} /> Approve changes
              </Button>
            </ConfirmationModalTrigger>
          </ConfirmationModal>

          {flowsheet.status !== 'NEW' && (
            <ConfirmationModal
              header="Discard changes"
              text="This will revert the flowsheet back to the last approved state. This action cannot be undone."
              submitLabel="Discard"
              submitIcon={<Undo size={15} />}
              theme="danger"
              onConfirm={() => discardChanges.mutate()}
            >
              <ConfirmationModalTrigger>
                <Button size="sm" variant="ghost">
                  <Undo size={15} /> Discard changes
                </Button>
              </ConfirmationModalTrigger>
            </ConfirmationModal>
          )}
        </>
      )}
    </Group>
  );
}

function RouteHeader() {
  const { flowsheet } = useFlowsheetContext();

  return (
    <Header showBorder={false}>
      <HeaderMain>
        <RouteBreadcrumbs />
        <FlowsheetActionsMenu flowsheet={flowsheet} />
        <FlowsheetStatusActions flowsheet={flowsheet} />
      </HeaderMain>
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
      <UnstyledButton onPress={() => navigate({ to: '/flowsheets', search: { tab: 'all' } })}>
        <Breadcrumb base>
          <Layers2 size={14} /> Flowsheets
        </Breadcrumb>
      </UnstyledButton>

      <Breadcrumb>
        <FlowsheetStatusIcon flowsheet={flowsheet} />

        <StatusBadge status={flowsheet.status} />

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

function ArchiveAlert() {
  const { flowsheet } = useFlowsheetContext();
  const { data: users } = useSuspenseQuery(userQueries.collection);

  if (!flowsheet.archivedAt) {
    return null;
  }

  const archiver = flowsheet.archivedBy ? users.map[flowsheet.archivedBy] : null;
  const archiveDate = formatDate(new Date(flowsheet.archivedAt));

  return (
    <div className={styles.archiveAlert}>
      <Archive size={14} />
      This flowsheet was archived {archiver ? `by ${archiver.username} ` : ''}on {archiveDate}.
      Future site generations will exclude this flowsheet.
    </div>
  );
}
