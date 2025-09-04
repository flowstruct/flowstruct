import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Divider, Stack, Text, Title } from '@mantine/core';
import { CatalogTabs } from '@/shared/components/CatalogTabs.tsx';

export const Route = createFileRoute('/_layout/catalog')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack>
      <div>
        <Title lh="md" order={2} fw={600}>
          Catalog
        </Title>

        <Text c="dimmed" size="sm">
          Manage resources that are used in study plans
        </Text>
      </div>

      <CatalogTabs />

      <Divider />

      <Outlet />
    </Stack>
  );
}
