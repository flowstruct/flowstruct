import styles from './sidebar.module.css';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import { ChevronsUpDown, Crown } from 'lucide-react';
import { Role } from '@/features/user/domain/user';
import { getUserInitials } from '@/features/user/domain/getUserInitials';
import { useMatches, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueries } from '@/features/user/queries';
import { sidebarSections, footerItems } from './sidebar-items';
import { UserAvatarMenu } from '@/features/user/components/user-avatar-menu';

export function Sidebar() {
  const navigate = useNavigate();
  const matches = useMatches();

  const fullPath = matches.at(-1)?.fullPath ?? '';
  const isActive = (route: string) => fullPath.includes(route);

  return (
    <aside className={styles.sidebar}>
      <UserProfile />

      <section className={styles.sidebarMenu}>
        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.header && (
              <section className={styles.sidebarMenuSection}>
                <h3>{section.header}</h3>
              </section>
            )}

            {section.items.map((item) => {
              return (
                <UnstyledButton
                  key={item.route}
                  className={styles.sidebarMenuItem}
                  data-active={isActive(item.route) || undefined}
                  onPress={() => navigate({ to: item.route })}
                >
                  <item.icon size={16} />
                  {item.label}
                </UnstyledButton>
              );
            })}
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        {footerItems.map((item) => {
          return (
            <UnstyledButton
              key={item.route}
              className={styles.sidebarMenuItem}
              data-active={isActive(item.route) || undefined}
              onPress={() => navigate({ to: item.route })}
            >
              <item.icon size={16} />
              {item.label}
            </UnstyledButton>
          );
        })}
      </footer>
    </aside>
  );
}

function UserProfile() {
  const { data: me } = useSuspenseQuery(userQueries.me);

  return (
    <UserAvatarMenu>
      <UnstyledButton className={styles.userProfile}>
        <div className={styles.userInitials}>{getUserInitials(me.username)}</div>

        <div>
          <h1 className={styles.username}>{me.username}</h1>

          <div className={styles.userRole}>
            <Crown size={13} />
            <p className={styles.userRole}>{Role[me.role as keyof typeof Role]}</p>
          </div>
        </div>

        <ChevronsUpDown className={styles.userProfileChevron} size={15} />
      </UnstyledButton>
    </UserAvatarMenu>
  );
}
