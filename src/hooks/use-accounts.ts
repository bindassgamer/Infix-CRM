/** Reads the account list through the API layer (src/api/accounts.ts). */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listAccounts, createAccount } from "@/api/accounts";
import type { Account } from "@/types/crm";

export const accountsQueryKey = ["accounts"] as const;

export function useAccounts() {
  const query = useQuery({ queryKey: accountsQueryKey, queryFn: listAccounts });

  return {
    accounts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Saves a new record and adds it to the cached list so the table updates instantly. */
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: (created: Account) => {
      queryClient.setQueryData<Account[]>(accountsQueryKey, (previous) => [created, ...(previous ?? [])]);
    },
  });
}
