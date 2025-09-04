import { formatTimeAgo } from '@/utils/formatTimeAgo.ts';
import { useUserList } from '@/features/user/hooks/useUserList.ts';

type Props = {
  at: Date;
  by: number | null;
};

export function LastUpdatedStats({ at, by }: Props) {
  const { data: users } = useUserList();

  const timeAgo = formatTimeAgo(new Date(at));
  let user;
  if (by) user = users[by];
  
  return `${timeAgo} ${user ? `(${user.username})` : ''}`;
}
