import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { getTableSearchSchema } from '@/shared/schemas.ts';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

export const Route = createFileRoute('/_app/flowsheets/')({
  component: RouteComponent,
  validateSearch: getTableSearchSchema(DefaultSearchValues()),
  search: {
    middlewares: [stripSearchParams(DefaultSearchValues())],
  },
})

function RouteComponent() {
  return <div>Hello "/_app/flowsheets/"!</div>
}
