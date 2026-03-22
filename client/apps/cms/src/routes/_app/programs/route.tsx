import { createFileRoute } from '@tanstack/react-router';
import { programQueries } from '@/features/program/queries';

export const Route = createFileRoute('/_app/programs')({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(programQueries.collection);
  },
});