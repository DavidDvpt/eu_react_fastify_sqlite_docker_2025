export function formatTierLevel(
  tierLevel: number | null | undefined,
): string {
  return tierLevel === null || tierLevel === undefined ? "" : `T${tierLevel}`;
}

export function formatItemNameWithTier({
  name,
  hasTierOption,
  isStackable,
  tierLevel,
}: {
  name: string;
  hasTierOption?: boolean;
  isStackable?: boolean;
  tierLevel?: number | null;
}): string {
  if (!hasTierOption || isStackable) return name;

  const tier = formatTierLevel(tierLevel);
  return tier ? `${name} ${tier}` : name;
}
