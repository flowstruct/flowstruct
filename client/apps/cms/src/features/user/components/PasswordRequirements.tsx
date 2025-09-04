import { Alert, List } from '@mantine/core';
import { Info } from 'lucide-react';

export function PasswordRequirements() {
  return (
    <Alert color="blue" icon={<Info size={18} />} title="Password Requirements">
      <List>
        <List.Item>Be at least 8 characters long</List.Item>
        <List.Item>Contains at least one uppercase letter</List.Item>
        <List.Item>Contains at least one lowercase letter</List.Item>
        <List.Item>Contains at least one number</List.Item>
        <List.Item>Contains at least one special character (@ $ ! % * ? &)</List.Item>
      </List>
    </Alert>
  );
}
