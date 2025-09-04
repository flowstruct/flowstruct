import { ReactNode } from 'react';
import { Stack } from '@mantine/core';

type Props = {
  header: ReactNode;
  children: ReactNode;
};

export function PageLayout({ header, children }: Props) {
  return (
    <Stack>
      {header}
      {children}
    </Stack>
  );
}
