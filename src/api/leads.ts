/**
 * Leads API — expects GET /leads/ and GET /leads/:id/
 * returning objects shaped like the Lead type in src/types/crm.ts
 * (including the nested `timeline` array).
 */
import { endpoints } from "@/api/endpoints";
import { fetchList, fetchOne } from "@/api/http";
import { mockLeads } from "@/mocks/crm";
import type { Lead } from "@/types/crm";

export function listLeads() {
  return fetchList<Lead>(endpoints.leads.list, mockLeads);
}

export function getLead(leadId: string) {
  return fetchOne<Lead>(
    endpoints.leads.detail(leadId),
    mockLeads.find((lead) => lead.id === leadId),
  );
}
