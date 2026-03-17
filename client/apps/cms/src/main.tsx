import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import '@mantine/core/styles.css';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingOverlay, MantineProvider } from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';
import { Check, Loader, X } from 'lucide-react';
import { ErrorObject } from '@/shared/types';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      successMessage?:
        | string
        | ((data: unknown, variables: unknown, context: unknown) => string)
        | undefined;
      loadingMessage?: string | ((variables: unknown) => string) | undefined;
      invalidate?: boolean;
    };
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const errorObject = error as unknown as ErrorObject;
      if (errorObject.statusCode === 401) {
        router
          .navigate({
            to: '/login',
          })
          .finally(() => {});
      }
    },
  }),
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
      if (mutation.meta?.invalidate !== false) {
        queryClient.invalidateQueries();
      }

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
      retry: (failureCount, error) => {
        const errorBody = error as unknown as ErrorObject;
        if (errorBody.statusCode === 401) return false;
        console.log('retry');
        return failureCount < 3;
      },
    },
  },
});

export const router = createRouter({
  routeTree,
  context: { queryClient, isAuthenticated: undefined! },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultPendingComponent: () => <LoadingOverlay visible zIndex={1000} />,
  defaultErrorComponent: () => null,
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
