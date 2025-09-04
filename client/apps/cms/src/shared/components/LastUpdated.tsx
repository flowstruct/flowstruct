import { History } from 'lucide-react';
import { Group, Text } from '@mantine/core';
import { LastUpdatedStats } from '@/shared/components/LastUpdatedStats.tsx';

type Props = {
  at: Date;
  by: number;
};

export function LastUpdated({ at, by }: Props) {
  return (
    <Group gap="xs">
      <History size={14} color="gray" />
      <Text c="dimmed" size="sm">
        Last Update:
      </Text>
      <Text c="dimmed" size="sm">
        <LastUpdatedStats at={at} by={by} />
      </Text>
    </Group>
  );
}
