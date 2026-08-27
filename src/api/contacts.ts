/**
 * Contacts API — expects GET /contacts/ and GET /contacts/:id/
 * returning objects shaped like the Contact type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { fetchList, fetchOne } from "@/api/http";
import { mockContacts } from "@/mocks/crm";
import type { Contact } from "@/types/crm";

export function listContacts() {
  return fetchList<Contact>(endpoints.contacts.list, mockContacts);
}

export function getContact(contactId: string) {
  return fetchOne<Contact>(
    endpoints.contacts.detail(contactId),
    mockContacts.find((contact) => contact.id === contactId),
  );
}
