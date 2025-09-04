import { createFileRoute } from '@tanstack/react-router';
import { ProgramMap } from '@/features/study-plan/components/ProgramMap.tsx';
import { ProgramMapProvider } from '@/contexts/ProgramMapContext';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/program-map')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProgramMapProvider>
      <ProgramMap />
    </ProgramMapProvider>
  );
}
