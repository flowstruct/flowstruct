import { useMatches, useNavigate } from '@tanstack/react-router';
import { Route as ProgramsRoute } from '@/routes/_layout/catalog/programs';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Route as CoursesRoute } from '@/routes/_layout/catalog/courses';
import { Tabs } from '@mantine/core';
import { NavbarLinks } from '@/shared/types.ts';

const tabs: NavbarLinks[] = [
  { label: 'Programs', icon: <GraduationCap size={18} />, route: ProgramsRoute.to },
  { label: 'Courses', icon: <BookOpen size={18} />, route: CoursesRoute.to },
];

export function CatalogTabs() {
  const matches = useMatches();
  const navigate = useNavigate();

  const fullPath = matches.at(-1)?.fullPath ?? '';
  const activeTab = tabs.find((tab) => fullPath.includes(tab.route))?.route ?? ProgramsRoute.to;

  return (
    <Tabs
      value={activeTab}
      onChange={(val) =>
        navigate({
          to: val ?? '',
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
