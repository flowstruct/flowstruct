import { createFileRoute } from '@tanstack/react-router';
import { useCurrentProgram } from '@/features/program/hooks/useCurrentProgram.ts';
import { Group } from '@mantine/core';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { InfoItem } from '@/shared/components/InfoItem.tsx';
import { Degree } from '@/features/program/types.ts';
import { EditDetailsButton } from '@/shared/components/EditDetailsButton.tsx';

export const Route = createFileRoute('/_layout/catalog/programs/$programId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: program } = useCurrentProgram();

  return (
    <AppCard
      title="Program Information"
      subtitle="Details about this program"
      headerAction={
        <EditDetailsButton
          to="/catalog/programs/$programId/edit"
          params={{ programId: String(program.id) }}
        />
      }
    >
      <Group grow>
        <InfoItem label="Code" value={program.code} />
        <InfoItem label="Name" value={program.name} />
      </Group>

      <Group grow>
        <InfoItem
          label="Degree"
          value={`${Degree[program.degree as keyof typeof Degree]} (${program.degree})`}
        />
      </Group>
    </AppCard>
  );
}
