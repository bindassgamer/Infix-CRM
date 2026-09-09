/**
 * Resources API — expects GET /resources/ and GET /resources/:id/
 * returning objects shaped like the Resource type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { createRecord, fetchList, fetchOne } from "@/api/http";
import { mockResources } from "@/mocks/crm";
import { createLocalId } from "@/lib/id";
import type { Resource, NewResource } from "@/types/crm";

export function listResources() {
  return fetchList<Resource>(endpoints.resources.list, mockResources);
}

export function getResource(resourceId: string) {
  return fetchOne<Resource>(
    endpoints.resources.detail(resourceId),
    mockResources.find((resource) => resource.id === resourceId),
  );
}

/** Creates an asset — expects POST /resources/ to return the saved record. */
export function createResource(input: NewResource) {
  return createRecord<Resource>(endpoints.resources.list, input, {
    id: createLocalId("RES"),
    ...input,
  });
}
