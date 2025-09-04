import { ActionIcon, Group, Title } from '@mantine/core';
import { Link, LinkProps } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  title: string | ReactNode;
  linkProps: LinkProps;
};

export function PageHeaderWithBack({ title, linkProps }: Props) {
  return (
    <Group gap="lg" wrap="nowrap">
      <Link {...linkProps}>
        <ActionIcon size={42} variant="default">
          <ArrowLeft size={18} />
        </ActionIcon>
      </Link>
      {typeof title === 'string' ? (
        <Title order={2} fw={600}>
          {title}
        </Title>
      ) : (
        title
      )}
    </Group>
  );
}
