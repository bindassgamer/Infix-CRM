/**
 * Accounts API — expects Django to expose GET /accounts/ and GET /accounts/:id/
 * returning objects shaped like the Account type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { createRecord, fetchList, fetchOne } from "@/api/http";
import { mockAccounts } from "@/mocks/crm";
import { createLocalId } from "@/lib/id";
import type { Account, NewAccount } from "@/types/crm";

export function listAccounts() {
  return fetchList<Account>(endpoints.accounts.list, mockAccounts);
}

export function getAccount(accountId: string) {
  return fetchOne<Account>(
    endpoints.accounts.detail(accountId),
    mockAccounts.find((account) => account.id === accountId),
  );
}

/** Creates an account — expects POST /accounts/ to return the saved record. */
export function createAccount(input: NewAccount) {
  return createRecord<Account>(endpoints.accounts.list, input, {
    id: createLocalId("ACC"),
    ...input,
  });
}
