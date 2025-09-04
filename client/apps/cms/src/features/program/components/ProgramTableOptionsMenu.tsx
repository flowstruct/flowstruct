import { ActionIcon, Menu } from '@mantine/core';
import { Ellipsis, Pencil, ScrollText } from 'lucide-react';
import { Program } from '@/features/program/types.ts';
import { Link } from '@tanstack/react-router';
import { ProgramDangerousOptionsMenuItems } from '@/features/program/components/ProgramDangerousOptionsMenuItems.tsx';

type Props = {
  program: Program;
};

export function ProgramTableOptionsMenu({ program }: Props) {
  return (
    <Menu shadow="md">
      <Menu.Target>
        <ActionIcon variant="transparent" color="gray">
          <Ellipsis size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Link
          style={{ textDecoration: 'none' }}
          to="/catalog/programs/$programId"
          params={{ programId: String(program.id) }}
        >
          <Menu.Item leftSection={<ScrollText size={14} />}>View</Menu.Item>
        </Link>
        <Link
          style={{ textDecoration: 'none' }}
          to="/catalog/programs/$programId/edit"
          params={{ programId: String(program.id) }}
        >
          <Menu.Item leftSection={<Pencil size={14} />}>Edit Details</Menu.Item>
        </Link>

        <ProgramDangerousOptionsMenuItems program={program} />
      </Menu.Dropdown>
    </Menu>
  );
}
