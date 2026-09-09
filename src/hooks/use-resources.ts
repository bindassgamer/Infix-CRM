/** Reads the creative resource library through the API layer (src/api/resources.ts). */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listResources, createResource } from "@/api/resources";
import type { Resource } from "@/types/crm";

export const resourcesQueryKey = ["resources"] as const;

export function useResources() {
  const query = useQuery({ queryKey: resourcesQueryKey, queryFn: listResources });

  return {
    resources: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Saves a new record and adds it to the cached list so the table updates instantly. */
export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResource,
    onSuccess: (created: Resource) => {
      queryClient.setQueryData<Resource[]>(resourcesQueryKey, (previous) => [created, ...(previous ?? [])]);
    },
  });
}
