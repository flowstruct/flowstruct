import { createFileRoute } from '@tanstack/react-router';
import { programQueries } from '@/features/program/queries.ts';

export const Route = createFileRoute('/_app/flowsheets')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(programQueries.collection);
  },
});
