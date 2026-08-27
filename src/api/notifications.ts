/**
 * Notifications API — expects GET /notifications/ and GET /notifications/:id/
 * returning objects shaped like the Notification type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { fetchList, fetchOne } from "@/api/http";
import { mockNotifications } from "@/mocks/crm";
import type { Notification } from "@/types/crm";

export function listNotifications() {
  return fetchList<Notification>(endpoints.notifications.list, mockNotifications);
}

export function getNotification(notificationId: string) {
  return fetchOne<Notification>(
    endpoints.notifications.detail(notificationId),
    mockNotifications.find((notification) => notification.id === notificationId),
  );
}
