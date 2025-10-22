import styles from './multi-select-toolbar.module.css';
import { TagIcon, Trash, X } from 'lucide-react';
import React from 'react';
import { Popover } from '../ui/Popover.tsx';
import Group from '../layout/group.tsx';
import { Button } from '../ui/Button.tsx';
import { Divider } from '../ui/divider.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';

export function MultiSelectToolbar() {
  const { selectedCourses, clearSelectedCourses } = useFlowsheetGrid();

  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.wrapper} ref={triggerRef}>
      <Popover
        triggerRef={triggerRef}
        isNonModal
        isOpen={selectedCourses.size > 0}
        className={styles.toolbar}
      >
        <Group gap={3}>
          <div className={styles.selectionCounter}>
            <Group>
              <p>{selectedCourses.size} selected</p>

              <Button
                variant="ghost"
                shape="icon"
                size="none"
                onPress={() => clearSelectedCourses()}
              >
                <X size={14} />
              </Button>
            </Group>
          </div>

          <Divider orientation="vertical" />

          <Group>
            <TooltipTrigger>
              <Button shape="icon" variant="flat" size="sm">
                <TagIcon size={14} />
              </Button>

              <Tooltip>Tag section</Tooltip>
            </TooltipTrigger>

            <TooltipTrigger>
              <Button shape="icon" size="sm" variant="flat">
                <Trash color="red" size={14} />
              </Button>

              <Tooltip>Remove courses</Tooltip>
            </TooltipTrigger>
          </Group>
        </Group>
      </Popover>
    </div>
  );
}
