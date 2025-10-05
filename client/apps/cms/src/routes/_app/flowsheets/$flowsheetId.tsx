import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { Header, HeaderMain } from '@/shared/components/header.tsx';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/breadcrumbs.tsx';
import { Layers2 } from 'lucide-react';
import {
  FlowsheetProvider,
  useFlowsheetContext,
} from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton.tsx';

export const Route = createFileRoute('/_app/flowsheets/$flowsheetId')({
  loader: ({ context: { queryClient }, params: { flowsheetId } }) => {
    queryClient.ensureQueryData(flowsheetQueries.detail(Number(flowsheetId)));
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
      </FlowsheetProvider>
    );
  },
});

function RouteBreadcrumbs() {
  const { flowsheet } = useFlowsheetContext();
  const { data: programs } = useSuspenseQuery(programQueries.collection);
  const navigate = useNavigate();

  const program = programs.map[flowsheet.program];
  if (!program) return;

  return (
    <Breadcrumbs>
      <UnstyledButton onPress={() => navigate({ to: '/flowsheets', search: { tab: 'active' } })}>
        <Breadcrumb base>
          <Layers2 size={14} /> Flowsheets
        </Breadcrumb>
      </UnstyledButton>

      <Breadcrumb>{getProgramDisplayName(program)}</Breadcrumb>
    </Breadcrumbs>
  );
}
