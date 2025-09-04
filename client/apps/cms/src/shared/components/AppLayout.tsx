import { ReactNode } from 'react';
import { Container, Group, Title } from '@mantine/core';
import classes from '../styles/AppLayout.module.css';
import { Me } from '@/features/user/components/Me.tsx';
import { AppTabs } from '@/shared/components/AppTabs.tsx';

type Props = {
  children: ReactNode;
};

export function AppLayout({ children }: Props) {
  return (
    <>
      <div className={classes.header}>
        <Container size="xl">
          <Group justify="space-between" pt="md" pb={8}>
            <Title order={4} fw={600}>
              Flowstruct CMS
            </Title>

            <Me />
          </Group>

          <Container size="lg">
            <AppTabs />
          </Container>
        </Container>
      </div>

      <div className={classes.content}>
        <Container size="xl">{children}</Container>
      </div>
    </>
  );
}
