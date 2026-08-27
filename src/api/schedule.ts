/**
 * Schedule API — expects GET /schedule-items/ and GET /schedule-items/:id/
 * returning objects shaped like the ScheduleItem type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { fetchList, fetchOne } from "@/api/http";
import { mockSchedule } from "@/mocks/crm";
import type { ScheduleItem } from "@/types/crm";

export function listScheduleItems() {
  return fetchList<ScheduleItem>(endpoints.schedule.list, mockSchedule);
}

export function getScheduleItem(scheduleItemId: string) {
  return fetchOne<ScheduleItem>(
    endpoints.schedule.detail(scheduleItemId),
    mockSchedule.find((item) => item.id === scheduleItemId),
  );
}
