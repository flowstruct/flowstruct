import { Alert } from '@mantine/core';
import { Archive } from 'lucide-react';
import { StudyPlan } from '../types';
import { useUserList } from '@/features/user/hooks/useUserList';
import { formatDate } from '@/utils/formatDate';

type Props = {
  studyPlan: StudyPlan;
};

export function ArchiveAlert({ studyPlan }: Props) {
  const { data: users } = useUserList();

  if (!studyPlan.archivedAt) {
    return null;
  }

  const archiver = studyPlan.archivedBy ? users[studyPlan.archivedBy] : null;
  const archiveDate = formatDate(studyPlan.archivedAt);

  return (
    <Alert color="orange" icon={<Archive />} autoContrast>
      This study plan was archived {archiver ? `by ${archiver.username} ` : ''}on {archiveDate}. It
      is no longer visible to students.
    </Alert>
  );
}
