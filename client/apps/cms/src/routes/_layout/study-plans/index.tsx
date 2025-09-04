import { createFileRoute, Link, stripSearchParams } from '@tanstack/react-router';
import { StudyPlansTable } from '@/features/study-plan/components/StudyPlansTable.tsx';
import { getTableSearchSchema } from '@/shared/schemas.ts';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Plus } from 'lucide-react';
import { StudyPlanListQuery } from '@/features/study-plan/queries.ts';

export const Route = createFileRoute('/_layout/study-plans/')({
  loader: ({context: {queryClient}}) => {
    queryClient.ensureQueryData(StudyPlanListQuery);
  },
  component: RouteComponent,
  validateSearch: getTableSearchSchema(DefaultSearchValues()),
  search: {
    middlewares: [stripSearchParams(DefaultSearchValues())],
  },
});

function RouteComponent() {
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title lh="md" order={2} fw={600}>
            Study Plan Pages
          </Title>

          <Text c="dimmed" size="sm">
            Manage all university study plans
          </Text>
        </div>

        <Link to="/study-plans/new">
          <Button leftSection={<Plus size={18} />}>Create New Study Plan</Button>
        </Link>
      </Group>

      <StudyPlansTable />
    </Stack>
  );
}
