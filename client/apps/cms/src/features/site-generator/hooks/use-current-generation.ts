import { useQuery } from '@tanstack/react-query';
import { siteGeneratorQueries, isActiveGeneration } from '@/features/site-generator/queries';

export function useCurrentGeneration() {
  const { data: currentGeneration } = useQuery(siteGeneratorQueries.current);
  
  return {
    currentGeneration,
    isActive: isActiveGeneration(currentGeneration?.status),
  };
}