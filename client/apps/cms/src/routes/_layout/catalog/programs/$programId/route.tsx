import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useCurrentProgram } from '@/features/program/hooks/useCurrentProgram.ts';
import { Group, Stack } from '@mantine/core';
import { getProgramDisplayName } from '@/utils/getProgramDisplayName.ts';
import { PageLayout } from '@/shared/components/PageLayout.tsx';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { LastUpdated } from '@/shared/components/LastUpdated.tsx';
import { ProgramQuery } from '@/features/program/queries.ts';
import { OutdatedAlert } from '@/shared/components/OutdatedAlert.tsx';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { ProgramOptionsMenu } from '@/features/program/components/ProgramOptionsMenu.tsx';

export const Route = createFileRoute('/_layout/catalog/programs/$programId')({
  loader: async ({ context: { queryClient }, params }) => {
    const programId = parseInt(params.programId);
    await queryClient.ensureQueryData(ProgramQuery(programId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: program } = useCurrentProgram();

  return (
    <PageLayout
      header={
        <Stack>
          <OutdatedAlert
            outdatedAt={program.outdatedAt}
            outdatedBy={program.outdatedBy}
            entityType="program"
          />
          <Group gap="lg" justify="space-between">
            <PageHeaderWithBack
              title={getProgramDisplayName(program)}
              linkProps={{
                to: '/catalog/programs',
                search: DefaultSearchValues(),
              }}
            />
            <Group>
              <LastUpdated at={program.updatedAt} by={program.updatedBy} />
              <ProgramOptionsMenu program={program} />
            </Group>
          </Group>
        </Stack>
      }
    >
      <Outlet />
    </PageLayout>
  );
}
