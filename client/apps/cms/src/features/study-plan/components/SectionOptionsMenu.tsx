import { ActionIcon, Menu, Text } from '@mantine/core';
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { Section } from '@/features/study-plan/types.ts';
import { modals } from '@mantine/modals';
import { useDeleteSection } from '@/features/study-plan/hooks/useDeleteSection.ts';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';

type Props = {
  section: Section;
};

export function SectionOptionsMenu({ section }: Props) {
  const { studyPlanId } = useParams({ from: '/_layout/study-plans/$studyPlanId' });
  const deleteSection = useDeleteSection();
  const navigate = useNavigate();

  const handleConfirmDelete = () =>
    deleteSection.mutate({
      studyPlanId: Number(studyPlanId),
      sectionId: section.id,
    });

  if (!section) return;

  return (
    <Menu shadow="md">
      <Menu.Target>
        <ActionIcon loading={deleteSection.isPending} variant="transparent" color="gray">
          <Ellipsis size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <Menu.Item
          onClick={() =>
            navigate({
              to: '/study-plans/$studyPlanId/sections/$sectionId/edit',
              params: { studyPlanId, sectionId: String(section.id) },
            })
          }
          leftSection={<Pencil size={14} />}
        >
          Edit Details
        </Menu.Item>

        <Menu.Item
          color="red"
          leftSection={<Trash size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            modals.openConfirmModal({
              title: <ModalHeader title="Please Confirm Your Action" />,
              children: (
                <Text size="sm">
                  Deleting this section will remove all of its courses from the program map as well,
                  are you absolutely sure?
                </Text>
              ),
              labels: { confirm: 'Confirm', cancel: 'Cancel' },
              onConfirm: handleConfirmDelete,
            });
          }}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
