/** Reads the studio roster through the API layer (src/api/team.ts). */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listTeamMembers, createTeamMember } from "@/api/team";
import type { Member } from "@/types/crm";

export const teamQueryKey = ["team-members"] as const;

export function useTeam() {
  const query = useQuery({ queryKey: teamQueryKey, queryFn: listTeamMembers });

  return {
    teamMembers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Saves a new record and adds it to the cached list so the table updates instantly. */
export function useCreateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeamMember,
    onSuccess: (created: Member) => {
      queryClient.setQueryData<Member[]>(teamQueryKey, (previous) => [created, ...(previous ?? [])]);
    },
  });
}
