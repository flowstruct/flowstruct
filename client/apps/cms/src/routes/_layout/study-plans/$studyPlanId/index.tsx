import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/')({
  component: () => {
    const { studyPlanId } = Route.useParams();

    return <Navigate to="/study-plans/$studyPlanId/details" params={{ studyPlanId }} />;
  },
});
