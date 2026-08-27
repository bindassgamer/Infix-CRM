/** Reads the lead pipeline through the API layer (src/api/leads.ts). */
import { useQuery } from "@tanstack/react-query";

import { listLeads } from "@/api/leads";

export const leadsQueryKey = ["leads"] as const;

export function useLeads() {
  const query = useQuery({ queryKey: leadsQueryKey, queryFn: listLeads });

  return {
    leads: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
