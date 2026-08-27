/** Reads the account list through the API layer (src/api/accounts.ts). */
import { useQuery } from "@tanstack/react-query";

import { listAccounts } from "@/api/accounts";

export const accountsQueryKey = ["accounts"] as const;

export function useAccounts() {
  const query = useQuery({ queryKey: accountsQueryKey, queryFn: listAccounts });

  return {
    accounts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
