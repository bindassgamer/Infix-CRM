/** Reads the studio roster through the API layer (src/api/team.ts). */
import { useQuery } from "@tanstack/react-query";

import { listTeamMembers } from "@/api/team";

export const teamQueryKey = ["team-members"] as const;

export function useTeam() {
  const query = useQuery({ queryKey: teamQueryKey, queryFn: listTeamMembers });

  return {
    teamMembers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
