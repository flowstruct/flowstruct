import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import '@mantine/core/styles.css';
import {
  matchQuery,
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from '@tanstack/react-query';
import { createTheme, LoadingOverlay, MantineColorsTuple, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { notifications, Notifications } from '@mantine/notifications';
import navigationProgressClasses from '@/shared/styles/NavigationProgress.module.css';
import { NavigationProgress } from '@mantine/nprogress';
import { NotFoundPage } from '@/shared/components/NotFoundPage.tsx';
import themeClasses from './theme.module.css';
import { Check, Loader, X } from 'lucide-react';
import { ErrorObject } from '@/shared/types.ts';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidates?:
        | Array<QueryKey>
        | ((data: unknown, variables: unknown, context: unknown) => Array<QueryKey>);
      removes?:
        | Array<QueryKey>
        | ((data: unknown, variables: unknown, context: unknown) => Array<QueryKey>);
      setData?: QueryKey | ((data: unknown, variables: unknown, context: unknown) => QueryKey);
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
          withBorder: true,
        });
      }
    },
    onSuccess: (data, variables, context, mutation) => {
      const invalidatesMeta = mutation.meta?.invalidates;
      const removesMeta = mutation.meta?.removes;
      const setDataMeta = mutation.meta?.setData;
      const successMessage = mutation.meta?.successMessage;

      if (invalidatesMeta) {
        const resolvedInvalidatesMeta =
          typeof invalidatesMeta === 'function'
            ? invalidatesMeta(data, variables, context)
            : invalidatesMeta;
        queryClient.invalidateQueries({
          predicate: (query) =>
            resolvedInvalidatesMeta.some((queryKey) => matchQuery({ queryKey }, query)) ?? false,
        });
      }

      if (removesMeta) {
        const resolvedRemovesMeta =
          typeof removesMeta === 'function' ? removesMeta(data, variables, context) : removesMeta;
        queryClient.removeQueries({
          predicate: (query) =>
            resolvedRemovesMeta.some((queryKey) => matchQuery({ queryKey }, query)) ?? false,
        });
      }

      if (setDataMeta) {
        const queryKey =
          typeof setDataMeta === 'function' ? setDataMeta(data, variables, context) : setDataMeta;

        queryClient.setQueryData(queryKey, data);
      }

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
          withBorder: true,
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
          withBorder: true,
          autoClose: 4000,
        });

        router.navigate({
          to: '/login',
          search: { redirect: window.location.pathname }
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
          withBorder: true,
        });

        errorObject.messages.slice(1).forEach((message) => {
          notifications.show({
            title: 'Error',
            message: message,
            color: 'red',
            icon: <X size={18} />,
            withBorder: true,
          });
        });
      } else {
        errorObject.messages.forEach((message) => {
          notifications.show({
            title: 'Error...',
            message: message || 'An unknown error occurred',
            color: 'red',
            icon: <X size={18} />,
            withBorder: true,
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
  defaultNotFoundComponent: () => <NotFoundPage />,
  defaultPendingComponent: () => (
    <LoadingOverlay visible zIndex={1000} loaderProps={{ type: 'bars' }} />
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const gjuColors: MantineColorsTuple = [
  '#e9f6ff',
  '#d7e8f8',
  '#aecfed',
  '#81b4e3',
  '#5d9edb',
  '#4790d6',
  '#3989d5',
  '#2b76bd',
  '#206bae',
  '#055a97',
];

const theme = createTheme({
  fontFamily: 'Helvetica',
  primaryColor: 'gju',
  colors: {
    gju: gjuColors,
  },
  activeClassName: themeClasses.active,
  defaultRadius: 'sm',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <NavigationProgress className={navigationProgressClasses.progress} />
        <ModalsProvider>
          <RouterProvider router={router} context={{ queryClient }} />
        </ModalsProvider>
        <Notifications />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
