/**
 * Schedule API — expects GET /schedule-items/ and GET /schedule-items/:id/
 * returning objects shaped like the ScheduleItem type in src/types/crm.ts.
 */
import { endpoints } from "@/api/endpoints";
import { createRecord, fetchList, fetchOne } from "@/api/http";
import { mockSchedule } from "@/mocks/crm";
import { createLocalId } from "@/lib/id";
import type { ScheduleItem, NewScheduleItem } from "@/types/crm";

export function listScheduleItems() {
  return fetchList<ScheduleItem>(endpoints.schedule.list, mockSchedule);
}

export function getScheduleItem(scheduleItemId: string) {
  return fetchOne<ScheduleItem>(
    endpoints.schedule.detail(scheduleItemId),
    mockSchedule.find((item) => item.id === scheduleItemId),
  );
}

/** Creates a calendar slot — expects POST /schedule-items/ to return the saved record. */
export function createScheduleItem(input: NewScheduleItem) {
  return createRecord<ScheduleItem>(endpoints.schedule.list, input, {
    id: createLocalId("SCH"),
    ...input,
  });
}
