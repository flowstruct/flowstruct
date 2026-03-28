import { Folder, FolderUp, Layers2, Settings2, User } from 'lucide-react';

export const sidebarSections = [
  {
    items: [
      {
        icon: FolderUp,
        label: 'Generate site',
        route: '/site-generations',
      },
      {
        icon: Layers2,
        label: 'Flowsheets',
        route: '/flowsheets',
      },
    ],
  },
  {
    header: 'Catalog',
    items: [
      {
        icon: Folder,
        label: 'Programs',
        route: '/programs',
      },
      {
        icon: Folder,
        label: 'Courses',
        route: '/courses',
      },
    ],
  },
  {
    header: 'Admin',
    items: [
      {
        icon: User,
        label: 'Manage users',
        route: '/admin/users',
      },
    ],
  },
];

export const footerItems = [
  {
    icon: Settings2,
    label: 'Settings',
    route: '/settings',
  },
];