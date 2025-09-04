import { useCurrentProgram } from '@/features/program/hooks/useCurrentProgram';
import { createFileRoute } from '@tanstack/react-router';
import { EditProgramFieldset } from '@/features/program/components/EditProgramFieldset.tsx';

export const Route = createFileRoute('/_layout/catalog/programs/$programId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: program } = useCurrentProgram();

  return <EditProgramFieldset program={program} />;
}
