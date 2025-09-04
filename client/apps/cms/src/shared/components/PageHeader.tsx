import { Group, Title } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  title: string;
  icon: ReactNode;
};

export function PageHeader({ title, icon }: Props) {
  return (
    <Group>
      {icon}
      <Title order={2} fw={600}>
        {title}
      </Title>
    </Group>
  );
}
