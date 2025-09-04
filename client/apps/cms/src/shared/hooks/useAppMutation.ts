import {
  DefaultError,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

interface AppMutationMeta<TData, TVariables, TContext> {
  invalidates?:
    | Array<QueryKey>
    | ((data: TData, variables: TVariables, context: TContext) => Array<QueryKey>);
  removes?:
    | Array<QueryKey>
    | ((data: TData, variables: TVariables, context: TContext) => Array<QueryKey>);
  setData?: QueryKey | ((data: TData, variables: TVariables, context: TContext) => QueryKey);
  successMessage?:
    | string
    | ((data: TData, variables: TVariables, context: TContext) => string)
    | undefined;
  loadingMessage?: string | ((variables: TVariables) => string) | undefined;
}

interface AppMutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'meta'> {
  meta?: AppMutationMeta<TData, TVariables, TContext>;
}

export function useAppMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: AppMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation({
    ...options,
    meta: options.meta as any,
  });
}
