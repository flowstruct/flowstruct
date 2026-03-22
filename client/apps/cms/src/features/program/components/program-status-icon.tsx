import { GraduationCap } from 'lucide-react';
import { Program } from '@/features/program/domain/program';
import styles from './program-status-icon.module.css';

type ProgramStatusIconProps = {
  program: Program;
};

export function ProgramStatusIcon({ program }: ProgramStatusIconProps) {
  return (
    <div
      data-outdated={program.outdatedAt != null ? true : undefined}
      className={styles.statusIcon}
    >
      <GraduationCap size={15} />
    </div>
  );
}