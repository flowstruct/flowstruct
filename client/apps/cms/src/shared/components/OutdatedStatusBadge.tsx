import { Badge, Tooltip } from '@mantine/core';
import classes from '@/shared/styles/ActiveStatus.module.css';
import { useUserList } from '@/features/user/hooks/useUserList';
import { formatDate } from '@/utils/formatDate';

type Props = {
  outdatedAt: Date | null;
  outdatedBy?: number | null;
  entityType?: 'program' | 'course';
};

export function OutdatedStatusBadge({ outdatedAt, outdatedBy, entityType = 'course' }: Props) {
  const isOutdated = outdatedAt !== null;
  const { data: users } = useUserList();

  const getTooltipMessage = () => {
    const user = outdatedBy ? users[outdatedBy] : null;
    const outdatedByUser = user ? user.username : null;
    const outdatedDate = formatDate(outdatedAt);

    return `This ${entityType} was marked as outdated ${outdatedByUser ? `by ${outdatedByUser} ` : ''}on 
      ${outdatedDate}. It may be replaced by a newer version.`;
  };

  const badge = (
    <Badge
      classNames={{ root: classes.root }}
      variant={isOutdated ? 'outline' : 'light'}
      color={isOutdated ? 'gray' : 'green'}
    >
      {isOutdated ? 'Outdated' : 'Active'}
    </Badge>
  );

  if (!isOutdated) {
    return badge;
  }

  return <Tooltip label={getTooltipMessage()}>{badge}</Tooltip>;
}
