import { ActionIcon, Menu } from '@mantine/core';
import { Ellipsis, ExternalLink, Pencil, ScrollText } from 'lucide-react';
import { StudyPlanSummary } from '@/features/study-plan/types.ts';
import { Link } from '@tanstack/react-router';
import { StudyPlanDangerMenuItems } from '@/features/study-plan/components/StudyPlanDangerMenuItems.tsx';
import { modals } from '@mantine/modals';
import { StudyPlanStudentViewLink } from '@/features/study-plan/components/StudyPlanStudentViewLink.tsx';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';

type Props = {
  studyPlan: StudyPlanSummary;
  onDeleteSuccess?: () => void;
};

export function StudyPlanTableOptionsMenu({ studyPlan, onDeleteSuccess }: Props) {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="transparent" color="gray">
          <Ellipsis size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <Link
          style={{ textDecoration: 'none' }}
          to="/study-plans/$studyPlanId/details"
          params={{ studyPlanId: String(studyPlan.id) }}
        >
          <Menu.Item leftSection={<ScrollText size={14} />}>View</Menu.Item>
        </Link>

        <Link
          style={{ textDecoration: 'none' }}
          to="/study-plans/$studyPlanId/details/edit"
          params={{ studyPlanId: String(studyPlan.id) }}
        >
          <Menu.Item leftSection={<Pencil size={14} />}>Edit Details</Menu.Item>
        </Link>

        <Menu.Item
          leftSection={<ExternalLink size={14} />}
          onClick={() => {
            modals.open({
              size: 'lg',
              title: (
                <ModalHeader
                  title="Student View Link"
                  subtitle="Click the link below to open the student view in a new tab, or use the copy button to share the URL"
                />
              ),
              children: <StudyPlanStudentViewLink studyPlanId={studyPlan.id} />,
            });
          }}
        >
          Student View Link
        </Menu.Item>

        <Menu.Divider />

        <StudyPlanDangerMenuItems studyPlan={studyPlan} onDeleteSuccess={onDeleteSuccess} />
      </Menu.Dropdown>
    </Menu>
  );
}
