import {
  createFileRoute,
  Link,
  retainSearchParams,
  stripSearchParams,
} from '@tanstack/react-router';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Plus } from 'lucide-react';
import { UsersTable } from '@/features/user/components/UsersTable.tsx';
import { getTableSearchSchema } from '@/shared/schemas.ts';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

export const Route = createFileRoute('/_layout/users/')({
  component: RouteComponent,
  validateSearch: getTableSearchSchema(DefaultSearchValues()),
  search: {
    middlewares: [stripSearchParams(DefaultSearchValues()), retainSearchParams(['page', 'size'])],
  },
});

function RouteComponent() {
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title lh="md" order={2} fw={600}>
            User Management
          </Title>

          <Text c="dimmed" size="sm">
            Manage all CMS users
          </Text>
        </div>

        <Link to="/users/new">
          <Button leftSection={<Plus size={18} />}>Create New User</Button>
        </Link>
      </Group>

      <UsersTable />
    </Stack>
  );
}
