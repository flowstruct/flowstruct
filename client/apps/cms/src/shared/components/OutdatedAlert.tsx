import { Alert } from '@mantine/core';
import { History } from 'lucide-react';
import { useUserList } from '@/features/user/hooks/useUserList';
import { formatDate } from '@/utils/formatDate';

type Props = {
  outdatedAt: Date;
  outdatedBy: number | null;
  entityType: 'program' | 'course';
};

export function OutdatedAlert({ outdatedAt, outdatedBy, entityType }: Props) {
  const { data: users } = useUserList();

  if (!outdatedAt) {
    return null;
  }

  const user = outdatedBy ? users[outdatedBy] : null;
  const outdatedByUser = user ? user.username : null;
  const outdatedDate = formatDate(outdatedAt);

  return (
    <Alert color="gray" icon={<History />} autoContrast>
      This {entityType} was marked as outdated {outdatedByUser ? `by ${outdatedByUser} ` : ''}on{' '}
      {outdatedDate}. It may be replaced by a newer version.
    </Alert>
  );
}
