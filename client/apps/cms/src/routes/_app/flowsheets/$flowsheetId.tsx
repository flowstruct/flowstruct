import { createFileRoute } from '@tanstack/react-router';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';

export const Route = createFileRoute('/_app/flowsheets/$flowsheetId')({
  loader: ({ context: { queryClient }, params: { flowsheetId } }) => {
    queryClient.ensureQueryData(flowsheetQueries.detail(Number(flowsheetId)));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { flowsheetId } = Route.useParams();

  return <div>Hello "/_app/flowsheets/{flowsheetId}"!</div>;
}
