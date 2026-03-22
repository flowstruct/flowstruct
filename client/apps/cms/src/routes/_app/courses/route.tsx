import { createFileRoute } from '@tanstack/react-router';
import { courseQueries } from '@/features/course/queries';

export const Route = createFileRoute('/_app/courses')({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      courseQueries.page({
        filter: '',
        page: 0,
        size: 20,
        status: 'active',
      })
    );
  },
});