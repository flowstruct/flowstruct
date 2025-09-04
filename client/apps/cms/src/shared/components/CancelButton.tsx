import { X } from 'lucide-react';
import { Button } from '@mantine/core';

type Props = {
  onClick: () => void;
};

export function CancelButton({ onClick }: Props) {
  return (
    <Button variant="default" onClick={onClick} leftSection={<X size={18} />}>
      Cancel
    </Button>
  );
}
