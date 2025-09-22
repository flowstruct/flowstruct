export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
};

export const Role = {
  ADMIN: 'Administrator',
  APPROVER: 'Approver',
  EDITOR: 'Editor',
  GUEST: 'Guest',
} as const;

export type UserAction =
  | 'study-plans:approve'
  | 'users:read'
  | 'study-plans:archive'
  | 'courses:mark-outdated'
  | 'programs:mark-outdated';
