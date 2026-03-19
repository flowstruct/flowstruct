import { useQuery, useQueryClient } from '@tanstack/react-query';
import { siteGeneratorQueries } from '@/features/site-generator/queries';
import React from 'react';

export function useCurrentGeneration() {
  const pollCount = React.useRef(0);
  const { data: current } = useQuery(siteGeneratorQueries.current);
  const queryClient = useQueryClient();
  const isActive = current?.status === 'PENDING' || current?.status === 'RUNNING';

  React.useEffect(() => {
    if (isActive) {
      pollCount.current += 1;
    } else if (pollCount.current > 0) {
      queryClient.invalidateQueries();
      pollCount.current = 0;
    }
  }, [current]);

  return {
    current,
    isActive,
  };
}
