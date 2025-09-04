import { Menu, Text } from '@mantine/core';
import { History, RotateCcw } from 'lucide-react';
import { Program } from '@/features/program/types.ts';
import { modals } from '@mantine/modals';
import { useMarkProgramOutdated } from '@/features/program/hooks/useMarkProgramOutdated.ts';
import { useMarkProgramActive } from '@/features/program/hooks/useMarkProgramActive.ts';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';
import { usePermission } from '@/features/user/hooks/usePermission.ts';

type Props = {
  program: Program;
};

export function ProgramDangerousOptionsMenuItems({ program }: Props) {
  const markProgramOutdated = useMarkProgramOutdated();
  const markProgramActive = useMarkProgramActive();

  const { hasPermission } = usePermission();

  const handleMarkOutdated = () =>
    modals.openConfirmModal({
      title: <ModalHeader title="Please Confirm Your Action" />,
      children: (
        <Text size="sm">
          Marking this program as outdated will indicate it's no longer in use. Are you sure you
          want to proceed?
        </Text>
      ),
      labels: { confirm: 'Mark Outdated', cancel: 'Cancel' },
      onConfirm: () => markProgramOutdated.mutate(program.id),
    });

  const handleMarkActive = () =>
    modals.openConfirmModal({
      title: <ModalHeader title="Please Confirm Your Action" />,
      children: (
        <Text size="sm">
          Marking this program as active will indicate it's currently in use. Are you sure you want
          to proceed?
        </Text>
      ),
      labels: { confirm: 'Mark Active', cancel: 'Cancel' },
      onConfirm: () => markProgramActive.mutate(program.id),
    });

  return (
    <>
      {hasPermission('programs:mark-outdated') && (
        <>
          <Menu.Divider />

          {program.outdatedAt ? (
            <Menu.Item
              color="green"
              leftSection={<RotateCcw size={14} />}
              onClick={handleMarkActive}
            >
              Mark as Active
            </Menu.Item>
          ) : (
            <Menu.Item
              color="orange"
              leftSection={<History size={14} />}
              onClick={handleMarkOutdated}
            >
              Mark as Outdated
            </Menu.Item>
          )}
        </>
      )}
    </>
  );
}
