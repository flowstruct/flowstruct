import { Text, Title } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  title: string | ReactNode;
  subtitle?: string;
};

export function ModalHeader({ title, subtitle }: Props) {
  return (
    <div>
      <Title order={4} fw={600} lh="md">
        {title}
      </Title>
      {subtitle && (
        <Text size="xs" c="dimmed">
          {subtitle}
        </Text>
      )}
    </div>
  );
}
