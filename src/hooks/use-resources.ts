/** Reads the creative resource library through the API layer (src/api/resources.ts). */
import { useQuery } from "@tanstack/react-query";

import { listResources } from "@/api/resources";

export const resourcesQueryKey = ["resources"] as const;

export function useResources() {
  const query = useQuery({ queryKey: resourcesQueryKey, queryFn: listResources });

  return {
    resources: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
