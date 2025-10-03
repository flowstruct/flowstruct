import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import '@mantine/core/styles.css';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingOverlay, MantineProvider } from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';
import { Check, Loader, X } from 'lucide-react';
import { ErrorObject } from '@/shared/types.ts';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      successMessage?:
        | string
        | ((data: unknown, variables: unknown, context: unknown) => string)
        | undefined;
      loadingMessage?: string | ((variables: unknown) => string) | undefined;
    };
  }
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onMutate: (variables, mutation) => {
      const successMessage = mutation.meta?.successMessage;
      const loadingMessage = mutation.meta?.loadingMessage || 'Processing...';

      if (successMessage) {
        notifications.show({
          id: `mutation-${mutation.mutationId}`,
          title: 'Loading',
          message:
            typeof loadingMessage === 'function' ? loadingMessage(variables) : loadingMessage,
          color: 'blue',
          icon: <Loader size={18} />,
          loading: true,
          autoClose: false,
        });
      }
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries();

      const successMessage = mutation.meta?.successMessage;

      if (successMessage) {
        notifications.update({
          id: `mutation-${mutation.mutationId}`,
          title: 'Success!',
          message:
            typeof successMessage === 'function'
              ? successMessage(data, variables, context)
              : successMessage,
          color: 'green',
          icon: <Check size={18} />,
          loading: false,
          autoClose: 4000,
        });
      }
    },
    onError: (error, _variables, _context, mutation) => {
      const errorObject = error as unknown as ErrorObject;

      if (errorObject.statusCode === 401) {
        queryClient.clear();

        notifications.show({
          title: 'Session Expired',
          message: 'Please log in again.',
          color: 'red',
          icon: <X size={18} />,
          autoClose: 4000,
        });

        router.navigate({
          to: '/login',
          search: { redirect: window.location.pathname },
        });

        return;
      }

      queryClient.invalidateQueries();

      const loadingNotification = mutation.meta?.successMessage;

      if (loadingNotification) {
        notifications.update({
          id: `mutation-${mutation.mutationId}`,
          title: 'Error',
          message: errorObject.messages[0] || 'An unknown error occurred',
          color: 'red',
          icon: <X size={18} />,
          loading: false,
          autoClose: 4000,
        });

        errorObject.messages.slice(1).forEach((message) => {
          notifications.show({
            title: 'Error',
            message: message,
            color: 'red',
            icon: <X size={18} />,
          });
        });
      } else {
        errorObject.messages.forEach((message) => {
          notifications.show({
            title: 'Error...',
            message: message || 'An unknown error occurred',
            color: 'red',
            icon: <X size={18} />,
          });
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 300000,
    },
  },
});

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  context: { queryClient, isAuthenticated: undefined! },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultPendingComponent: () => <LoadingOverlay visible zIndex={1000} />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ queryClient }} />
      </QueryClientProvider>
      <Notifications />
    </MantineProvider>
  </StrictMode>
);
