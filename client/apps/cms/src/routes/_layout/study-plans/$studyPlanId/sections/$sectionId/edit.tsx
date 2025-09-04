import { createFileRoute, Navigate } from '@tanstack/react-router';
import { PageLayout } from '@/shared/components/PageLayout.tsx';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { DefaultFrameworkCoursesSearchValues } from '@/utils/defaultFrameworkCoursesSearchValues.ts';
import { getSectionDisplayName } from '@/utils/getSectionDisplayName.ts';
import { EditSectionFieldset } from '@/features/study-plan/components/EditSectionFieldset.tsx';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/sections/$sectionId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { studyPlanId, sectionId } = Route.useParams();
  const currentSectionId = Number(sectionId);

  const { data: studyPlan } = useCurrentStudyPlan();
  const section = studyPlan.sections.find((s) => s.id === currentSectionId);
  if (!section)
    return (
      <Navigate
        to="/study-plans/$studyPlanId/sections"
        params={{ studyPlanId }}
        search={DefaultFrameworkCoursesSearchValues()}
      />
    );

  return (
    <PageLayout
      header={
        <PageHeaderWithBack
          linkProps={{ to: '/study-plans/$studyPlanId/sections', params: { studyPlanId } }}
          title={getSectionDisplayName(section)}
        />
      }
    >
      <EditSectionFieldset section={section} />
    </PageLayout>
  );
}
