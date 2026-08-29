/**
 * Thin fetch wrapper for the Django REST backend.
 *
 * Set VITE_API_BASE_URL (for example http://localhost:8000/api) in .env.
 * While that variable is missing — or a request fails — every API function
 * resolves with the demo records in src/mocks/crm.ts so the UI keeps working.
 */

export const API_BASE_URL = (import.meta.env['VITE_API_BASE_URL'] ?? "").replace(/\/+$/, "");

/** True while no backend is configured. Remove this once Django is wired up. */
export const USE_MOCKS = API_BASE_URL === "";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Django REST paths conventionally end with a slash. */
function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const withTrailingSlash = normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`;
  return `${API_BASE_URL}${withTrailingSlash}`;
}

async function requestJson<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const url = buildUrl(path);
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, url);
  }

  return (await response.json()) as TResponse;
}

/**
 * Reads a collection from the backend, falling back to demo data.
 * Django REST pagination ({ results: [...] }) is unwrapped automatically.
 */
export async function fetchList<TItem>(path: string, fallback: TItem[]): Promise<TItem[]> {
  if (USE_MOCKS) return fallback;

  try {
    const payload = await requestJson<TItem[] | { results: TItem[] }>(path);
    return Array.isArray(payload) ? payload : payload.results;
  } catch (error) {
    console.warn(`[api] falling back to demo data for ${path}`, error);
    return fallback;
  }
}

/** Reads a single record from the backend, falling back to demo data. */
export async function fetchOne<TItem>(path: string, fallback: TItem | undefined) {
  if (USE_MOCKS) return fallback ?? null;

  try {
    return await requestJson<TItem>(path);
  } catch (error) {
    console.warn(`[api] falling back to demo data for ${path}`, error);
    return fallback ?? null;
  }
}
