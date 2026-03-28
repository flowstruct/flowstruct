import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { userQueries } from '@/features/user/queries';
import { userApi } from '@/features/user/api';
import { MonitorX } from 'lucide-react';
import styles from './__root.module.css';

function MobileOverlay() {
  return (
    <div className={styles.mobileOverlay}>
      <MonitorX size={64} strokeWidth={1.5} className={styles.icon} />
      <div>
        <div className={styles.title}>Desktop only</div>
        <div className={styles.message}>
          This CMS is designed for desktop use. Please switch to a larger screen for the best
          experience.
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  isAuthenticated: boolean;
}>()({
  beforeLoad: async ({ context }) => {
    try {
      const me = await userApi.getMe();
      context.queryClient.setQueryData(userQueries.me.queryKey, me);

      return {
        isAuthenticated: true,
      };
    } catch {
      return {
        isAuthenticated: false,
      };
    }
  },
  component: () => (
    <>
      <MobileOverlay />
      <Outlet />
    </>
  ),
});
