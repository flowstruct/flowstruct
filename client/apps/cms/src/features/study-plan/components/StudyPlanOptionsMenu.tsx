import { ActionIcon, Menu } from '@mantine/core';
import { StudyPlanDangerMenuItems } from '@/features/study-plan/components/StudyPlanDangerMenuItems.tsx';
import { StudyPlanSummary } from '@/features/study-plan/types.ts';
import { EllipsisVertical, ExternalLink } from 'lucide-react';
import { modals } from '@mantine/modals';
import { StudyPlanStudentViewLink } from './StudyPlanStudentViewLink.tsx';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';

type Props = {
  studyPlan: StudyPlanSummary;
};

export function StudyPlanOptionsMenu({ studyPlan }: Props) {
  return (
    <Menu
      width={200}
      shadow="sm"
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      keepMounted
    >
      <Menu.Target>
        <ActionIcon variant="transparent" color="gray">
          <EllipsisVertical size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

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

        <StudyPlanDangerMenuItems studyPlan={studyPlan} />
      </Menu.Dropdown>
    </Menu>
  );
}
