import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const useDelayedSkeleton = (queryOptions: any, delay = 250) => {
  const query = useQuery(queryOptions);
  const [showSkeleton, setShowSkeleton] = React.useState(false);

  React.useEffect(() => {
    if (!query.isFetching) {
      setShowSkeleton(false);
      return;
    }
    const timeout = setTimeout(() => setShowSkeleton(true), delay);
    return () => clearTimeout(timeout);
  }, [query.isFetching, delay]);

  return showSkeleton;
};
