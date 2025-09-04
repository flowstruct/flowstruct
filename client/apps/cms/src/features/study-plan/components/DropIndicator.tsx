import classes from '@/features/study-plan/styles/ProgramMap.module.css';
import { CoursePlacement } from '@/features/study-plan/types.ts';

type Props = {
  placement: CoursePlacement;
};

export function DropIndicator({ placement }: Props) {
  return <div data-placement={JSON.stringify(placement)} className={classes.dropIndicator} />;
}
