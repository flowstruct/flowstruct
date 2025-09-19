import { createFileRoute, Link, stripSearchParams } from '@tanstack/react-router';
import { getTableSearchSchema } from '@/shared/schemas.ts';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import {
  Breadcrumb,
  Breadcrumbs,
  Header,
  HeaderLeft,
  HeaderRight,
} from '@/shared/components/new/header.tsx';
import { Layers2, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui2/Button.tsx';

export const Route = createFileRoute('/_app/flowsheets/')({
  component: RouteComponent,
  validateSearch: getTableSearchSchema(DefaultSearchValues()),
  search: {
    middlewares: [stripSearchParams(DefaultSearchValues())],
  },
});

function RouteComponent() {
  return (
    <div>
      <Header>
        <HeaderLeft>
          <Breadcrumbs>
            <Link to="/flowsheets" search={DefaultSearchValues()}>
              <Breadcrumb base>
                <Layers2 size={14} /> Flowsheets
              </Breadcrumb>
            </Link>
          </Breadcrumbs>
        </HeaderLeft>

        <HeaderRight>
          <Button variant="transparent">
            <Plus size={16} />
          </Button>
        </HeaderRight>
      </Header>
      <div></div>
    </div>
  );
}
