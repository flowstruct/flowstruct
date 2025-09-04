import { Card, Group, Stack, Text } from '@mantine/core';
import { ReactNode } from 'react';

type AppCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
};

export function AppCard({ title, subtitle, children, footer, headerAction }: AppCardProps) {
  return (
    <Card padding="lg" pt="md" withBorder>
      <Card.Section style={{backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))'}} p="md" withBorder>
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={600}>
              {title}
            </Text>
            {subtitle && (
              <Text size="xs" c="dimmed">
                {subtitle}
              </Text>
            )}
          </div>
          {headerAction}
        </Group>
      </Card.Section>

      <Card.Section py="md" inheritPadding>
        <Stack gap="lg">
          {children}
          {footer && (
            <Group justify="space-between" mt="xs">
              {footer}
            </Group>
          )}
        </Stack>
      </Card.Section>
    </Card>
  );
}
