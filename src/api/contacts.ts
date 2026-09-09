/**
 * Contacts API — expects GET /contacts/ and GET /contacts/:id/
 * returning objects shaped like the Contact type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { createRecord, fetchList, fetchOne } from "@/api/http";
import { mockContacts } from "@/mocks/crm";
import { createLocalId } from "@/lib/id";
import type { Contact, NewContact } from "@/types/crm";

export function listContacts() {
  return fetchList<Contact>(endpoints.contacts.list, mockContacts);
}

export function getContact(contactId: string) {
  return fetchOne<Contact>(
    endpoints.contacts.detail(contactId),
    mockContacts.find((contact) => contact.id === contactId),
  );
}

/** Creates a contact — expects POST /contacts/ to return the saved record. */
export function createContact(input: NewContact) {
  return createRecord<Contact>(endpoints.contacts.list, input, {
    id: createLocalId("CON"),
    ...input,
  });
}
