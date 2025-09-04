import { Group, Text } from '@mantine/core';
import { OutdatedStatusBadge } from '@/shared/components/OutdatedStatusBadge';

type EntityType = 'course' | 'program';

type Entity = {
  name: string;
  outdatedAt: Date | null;
  outdatedBy: number | null;
};

interface Props {
  entity: Entity;
  entityType: EntityType;
  label?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function EntityNameWithStatus({
  entity,
  entityType,
  label,
  className,
  size = 'sm',
}: Props) {
  const isOutdated = entity.outdatedAt !== null;

  return (
    <Group gap="xs" wrap="nowrap">
      <Text className={className} size={size}>
        {label ?? entity.name}
      </Text>
      {isOutdated && (
        <OutdatedStatusBadge
          outdatedAt={entity.outdatedAt}
          outdatedBy={entity.outdatedBy}
          entityType={entityType}
        />
      )}
    </Group>
  );
}
