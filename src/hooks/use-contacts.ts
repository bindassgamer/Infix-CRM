/** Reads the contact list through the API layer (src/api/contacts.ts). */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listContacts, createContact } from "@/api/contacts";
import type { Contact } from "@/types/crm";

export const contactsQueryKey = ["contacts"] as const;

export function useContacts() {
  const query = useQuery({ queryKey: contactsQueryKey, queryFn: listContacts });

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Saves a new record and adds it to the cached list so the table updates instantly. */
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: (created: Contact) => {
      queryClient.setQueryData<Contact[]>(contactsQueryKey, (previous) => [created, ...(previous ?? [])]);
    },
  });
}
