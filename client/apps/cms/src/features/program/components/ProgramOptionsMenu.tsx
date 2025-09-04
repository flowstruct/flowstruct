import { ActionIcon, Menu } from '@mantine/core';
import { EllipsisVertical } from 'lucide-react';
import { Program } from '@/features/program/types.ts';
import { ProgramDangerousOptionsMenuItems } from '@/features/program/components/ProgramDangerousOptionsMenuItems.tsx';

type Props = {
  program: Program;
};

export function ProgramOptionsMenu({ program }: Props) {
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

        <ProgramDangerousOptionsMenuItems program={program} />
      </Menu.Dropdown>
    </Menu>
  );
}
