import { RegisteredRouter, useParams } from '@tanstack/react-router';
import React from 'react';

type AllRouteParams = ReturnType<typeof useParams<RegisteredRouter, undefined, false>>;
type ParamKeyUnion = keyof AllRouteParams;

type UseEntityIdProps = {
  paramKey: ParamKeyUnion;
  fallback?: number;
};

export const useParamId = ({ paramKey, fallback }: UseEntityIdProps) => {
  const params = useParams({ strict: false });

  const id = React.useMemo(() => {
    const raw = params[paramKey];
    const parsed = raw ? parseInt(raw, 10) : undefined;
    return parsed ?? fallback;
  }, [params, paramKey, fallback]);

  if (!id) throw new Error(`Missing ${String(paramKey)} ID in URL and no fallback provided`);

  return id;
};
