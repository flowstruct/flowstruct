import { Paper } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function DetailsCard({ children }: Props) {
  return <Paper p="md" withBorder>{children}</Paper>;
}
