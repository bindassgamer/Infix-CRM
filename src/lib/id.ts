/**
 * Builds a readable local id (for example "ACC-1042") for records created
 * while no backend is configured. Django assigns real ids once it is live.
 */
export function createLocalId(prefix: string): string {
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${suffix}`;
}
