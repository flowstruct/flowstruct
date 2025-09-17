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