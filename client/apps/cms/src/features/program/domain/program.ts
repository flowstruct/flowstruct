export const Degree = {
  BSc: 'Bachelor of Science',
  BA: 'Bachelor of Arts',
  MBA: 'Master of Business Administration',
  MS: 'Master of Science',
  MA: 'Master of Arts',
  PHD: 'Doctor of Philosophy',
} as const;

export type Program = {
  id: number;
  code: string;
  name: string;
  degree: string;
  outdatedAt: Date;
  outdatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
};
