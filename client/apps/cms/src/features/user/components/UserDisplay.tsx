import { useMe } from '@/features/user/hooks/useMe.ts';
import { Stack } from '@mantine/core';
import { DetailsCard } from '@/shared/components/DetailsCard.tsx';
import { InfoItem } from '@/shared/components/InfoItem.tsx';

export function UserDisplay() {
  const { data: me } = useMe();

  return (
    <DetailsCard>
      <Stack>
        <InfoItem label="Username" value={me.username} />
        <InfoItem label="Email" value={me.email} />
        <InfoItem label="Role" value={me.role} />
      </Stack>
    </DetailsCard>
  );
}
