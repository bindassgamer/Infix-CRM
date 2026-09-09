/** Reads the lead pipeline through the API layer (src/api/leads.ts). */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listLeads, createLead } from "@/api/leads";
import type { Lead } from "@/types/crm";

export const leadsQueryKey = ["leads"] as const;

export function useLeads() {
  const query = useQuery({ queryKey: leadsQueryKey, queryFn: listLeads });

  return {
    leads: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Saves a new record and adds it to the cached list so the table updates instantly. */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: (created: Lead) => {
      queryClient.setQueryData<Lead[]>(leadsQueryKey, (previous) => [created, ...(previous ?? [])]);
    },
  });
}
