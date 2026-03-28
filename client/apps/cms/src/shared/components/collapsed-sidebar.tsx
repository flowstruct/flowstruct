import styles from './collapsed-sidebar.module.css';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip';
import { useMatches, useNavigate } from '@tanstack/react-router';
import { sidebarSections, footerItems } from './sidebar-items';
import { getUserInitials } from '@/features/user/domain/getUserInitials';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueries } from '@/features/user/queries';
import { Pressable } from 'react-aria';
import { UserAvatarMenu } from '@/features/user/components/user-avatar-menu';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';

export function CollapsedSidebar() {
  const navigate = useNavigate();
  const matches = useMatches();
  const { data: me } = useSuspenseQuery(userQueries.me);

  const fullPath = matches.at(-1)?.fullPath ?? '';
  const isActive = (route: string) => fullPath.includes(route);

  return (
    <aside className={styles.sidebar}>
      <UserAvatarMenu>
        <UnstyledButton className={styles.userInitials}>
          {getUserInitials(me.username)}
        </UnstyledButton>
      </UserAvatarMenu>

      <section className={styles.sidebarMenu}>
        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.items.map((item) => {
              return (
                <TooltipTrigger key={item.route}>
                  <Pressable onPress={() => navigate({ to: item.route })}>
                    <div
                      role="button"
                      className={styles.sidebarMenuItem}
                      data-active={isActive(item.route) || undefined}
                    >
                      <item.icon size={18} />
                    </div>
                  </Pressable>
                  <Tooltip placement="right">{item.label}</Tooltip>
                </TooltipTrigger>
              );
            })}
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        {footerItems.map((item) => {
          return (
            <TooltipTrigger key={item.route}>
              <Pressable onPress={() => navigate({ to: item.route })}>
                <div role="button" className={styles.sidebarMenuItem}>
                  <item.icon size={18} />
                </div>
              </Pressable>
              <Tooltip placement="right">{item.label}</Tooltip>
            </TooltipTrigger>
          );
        })}
      </footer>
    </aside>
  );
}
