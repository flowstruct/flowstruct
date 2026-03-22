import { PropsWithChildren } from 'react';

export function Scrollable({ children }: PropsWithChildren) {
  return <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>;
}
