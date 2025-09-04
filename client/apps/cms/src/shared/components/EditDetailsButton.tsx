import { Button } from '@mantine/core';
import { Pencil } from 'lucide-react';
import { Link, LinkProps } from '@tanstack/react-router';

export function EditDetailsButton(linkProps: LinkProps) {
  return (
    <Link {...linkProps}>
      <Button leftSection={<Pencil size={16} />} variant="outline">
        Edit Details
      </Button>
    </Link>
  );
}
