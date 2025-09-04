import { Card, Stack } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
};

export function SimpleAppCard({ children }: Props) {
  return (
    <Card shadow="sm" padding="lg" pt="md" withBorder>

        {children}
      </Card.Section>
    </Card>
  );
}
