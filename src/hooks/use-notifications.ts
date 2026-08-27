/** Reads the alert inbox through the API layer (src/api/notifications.ts). */
import { useQuery } from "@tanstack/react-query";

import { listNotifications } from "@/api/notifications";

export const notificationsQueryKey = ["notifications"] as const;

export function useNotifications() {
  const query = useQuery({ queryKey: notificationsQueryKey, queryFn: listNotifications });

  return {
    notifications: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
