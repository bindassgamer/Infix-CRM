/** Reads the publishing calendar through the API layer (src/api/schedule.ts). */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listScheduleItems, createScheduleItem } from "@/api/schedule";
import type { ScheduleItem } from "@/types/crm";

export const scheduleQueryKey = ["schedule-items"] as const;

export function useSchedule() {
  const query = useQuery({ queryKey: scheduleQueryKey, queryFn: listScheduleItems });

  return {
    scheduleItems: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Saves a new record and adds it to the cached list so the table updates instantly. */
export function useCreateScheduleItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createScheduleItem,
    onSuccess: (created: ScheduleItem) => {
      queryClient.setQueryData<ScheduleItem[]>(scheduleQueryKey, (previous) => [created, ...(previous ?? [])]);
    },
  });
}
