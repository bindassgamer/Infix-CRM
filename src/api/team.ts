/**
 * Team API — expects GET /team-members/ and GET /team-members/:id/
 * returning objects shaped like the Member type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { createRecord, fetchList, fetchOne } from "@/api/http";
import { mockTeam } from "@/mocks/crm";
import { createLocalId } from "@/lib/id";
import type { Member, NewMember } from "@/types/crm";

export function listTeamMembers() {
  return fetchList<Member>(endpoints.team.list, mockTeam);
}

export function getTeamMember(memberId: string) {
  return fetchOne<Member>(
    endpoints.team.detail(memberId),
    mockTeam.find((member) => member.id === memberId),
  );
}

/** Creates a team member — expects POST /team-members/ to return the saved record. */
export function createTeamMember(input: NewMember) {
  return createRecord<Member>(endpoints.team.list, input, {
    id: createLocalId("MEM"),
    ...input,
  });
}
