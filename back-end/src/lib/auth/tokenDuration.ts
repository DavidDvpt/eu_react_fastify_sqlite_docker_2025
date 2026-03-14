const DURATION_UNITS_IN_SECONDS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
} as const;

type DurationUnit = keyof typeof DURATION_UNITS_IN_SECONDS;

export function parseDurationToSeconds(duration: string): number {
  const normalized = duration.trim().toLowerCase();
  const match = normalized.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Unsupported duration format: ${duration}`);
  }

  const [, rawValue, unit] = match;
  return Number(rawValue) * DURATION_UNITS_IN_SECONDS[unit as DurationUnit];
}
