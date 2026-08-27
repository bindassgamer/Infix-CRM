/** Reads the publishing calendar through the API layer (src/api/schedule.ts). */
import { useQuery } from "@tanstack/react-query";

import { listScheduleItems } from "@/api/schedule";

export const scheduleQueryKey = ["schedule-items"] as const;

export function useSchedule() {
  const query = useQuery({ queryKey: scheduleQueryKey, queryFn: listScheduleItems });

  return {
    scheduleItems: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
