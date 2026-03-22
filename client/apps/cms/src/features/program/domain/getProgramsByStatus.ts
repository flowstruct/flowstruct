import { Program } from '@/features/program/domain/program';

export type ProgramStatus = 'all' | 'active' | 'outdated';

export const getProgramsByStatus = (programs: Program[], status: ProgramStatus) => {
  switch (status) {
    case 'active':
      return programs.filter((p) => p.outdatedAt == null);
    case 'outdated':
      return programs.filter((p) => p.outdatedAt != null);
    default:
      return programs;
  }
};
