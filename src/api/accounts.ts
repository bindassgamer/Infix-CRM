/**
 * Accounts API — expects Django to expose GET /accounts/ and GET /accounts/:id/
 * returning objects shaped like the Account type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { fetchList, fetchOne } from "@/api/http";
import { mockAccounts } from "@/mocks/crm";
import type { Account } from "@/types/crm";

export function listAccounts() {
  return fetchList<Account>(endpoints.accounts.list, mockAccounts);
}

export function getAccount(accountId: string) {
  return fetchOne<Account>(
    endpoints.accounts.detail(accountId),
    mockAccounts.find((account) => account.id === accountId),
  );
}
