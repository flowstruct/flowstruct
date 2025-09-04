import { useMatches, useNavigate, useParams } from '@tanstack/react-router';
import { Route as DetailsRoute } from '@/routes/_layout/study-plans/$studyPlanId/details';
import { BookOpen, List, Map, ReceiptText } from 'lucide-react';
import { Route as StudyPlanCoursesRoute } from '@/routes/_layout/study-plans/$studyPlanId/courses.tsx';
import { Route as ProgramMapRoute } from '@/routes/_layout/study-plans/$studyPlanId/program-map.tsx';
import { Route as SectionsRoute } from '@/routes/_layout/study-plans/$studyPlanId/sections';
import { Tabs } from '@mantine/core';
import { NavbarLinks } from '@/shared/types.ts';

const tabs: NavbarLinks[] = [
  { label: 'Details', icon: <ReceiptText size={18} />, route: DetailsRoute.to },
  { label: 'Sections', icon: <List size={18} />, route: SectionsRoute.to },
  { label: 'Courses', icon: <BookOpen size={18} />, route: StudyPlanCoursesRoute.to },
  { label: 'Program Map', icon: <Map size={18} />, route: ProgramMapRoute.to },
];

export function StudyPlanTabs() {
  const { studyPlanId } = useParams({ from: '/_layout/study-plans/$studyPlanId' });
  const matches = useMatches();
  const navigate = useNavigate();

  const fullPath = matches.at(-1)?.fullPath ?? '';
  const activeTab = tabs.find((tab) => fullPath.includes(tab.route))?.route ?? DetailsRoute.to;

  return (
    <Tabs
      value={activeTab}
      onChange={(val) =>
        navigate({
          to: val ?? '',
          params: { studyPlanId: studyPlanId },
        })
      }
      variant="pills"
    >
      <Tabs.List>
        {tabs.map((tab, index) => (
          <Tabs.Tab key={index} value={tab.route} leftSection={tab.icon}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
