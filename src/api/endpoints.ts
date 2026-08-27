/**
 * Every backend path the frontend calls, in one place.
 * Paths are relative to VITE_API_BASE_URL (see src/api/http.ts).
 */
export const endpoints = {
  accounts: {
    list: "/accounts",
    detail: (accountId: string) => `/accounts/${accountId}`,
  },
  contacts: {
    list: "/contacts",
    detail: (contactId: string) => `/contacts/${contactId}`,
  },
  leads: {
    list: "/leads",
    detail: (leadId: string) => `/leads/${leadId}`,
  },
  resources: {
    list: "/resources",
    detail: (resourceId: string) => `/resources/${resourceId}`,
  },
  team: {
    list: "/team-members",
    detail: (memberId: string) => `/team-members/${memberId}`,
  },
  schedule: {
    list: "/schedule-items",
    detail: (scheduleItemId: string) => `/schedule-items/${scheduleItemId}`,
  },
  notifications: {
    list: "/notifications",
    detail: (notificationId: string) => `/notifications/${notificationId}`,
  },
} as const;
