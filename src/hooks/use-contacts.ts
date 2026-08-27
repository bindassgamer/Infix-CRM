/** Reads the contact list through the API layer (src/api/contacts.ts). */
import { useQuery } from "@tanstack/react-query";

import { listContacts } from "@/api/contacts";

export const contactsQueryKey = ["contacts"] as const;

export function useContacts() {
  const query = useQuery({ queryKey: contactsQueryKey, queryFn: listContacts });

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
