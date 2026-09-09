/**
 * Leads API — expects GET /leads/ and GET /leads/:id/
 * returning objects shaped like the Lead type in src/types/crm.ts
 * (including the nested `timeline` array).
 */
import { endpoints } from "@/api/endpoints";
import { createRecord, fetchList, fetchOne } from "@/api/http";
import { mockLeads } from "@/mocks/crm";
import { createLocalId } from "@/lib/id";
import type { Lead, NewLead } from "@/types/crm";

export function listLeads() {
  return fetchList<Lead>(endpoints.leads.list, mockLeads);
}

export function getLead(leadId: string) {
  return fetchOne<Lead>(
    endpoints.leads.detail(leadId),
    mockLeads.find((lead) => lead.id === leadId),
  );
}

/** Creates a lead — expects POST /leads/ to return the saved record. */
export function createLead(input: NewLead) {
  return createRecord<Lead>(endpoints.leads.list, input, {
    id: createLocalId("LEAD"),
    ...input,
  });
}
