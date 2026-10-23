export const IMAGE_VARIANTS = ['micro', 'normal', 'original'] as const;

export type ImageVariant = (typeof IMAGE_VARIANTS)[number];

export type ImageEntry = Record<ImageVariant, string | null>;

export type ImageCatalog = {
  items: Record<string, ImageEntry>;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

function isImageEntry(value: unknown): value is ImageEntry {
  if (!value || typeof value !== 'object') return false;

  return IMAGE_VARIANTS.every((variant) => {
    const entryValue = (value as Record<string, unknown>)[variant];
    return entryValue === null || typeof entryValue === 'string';
  });
}

export function parseImageCatalog(value: unknown): ImageCatalog {
  if (!value || typeof value !== 'object') {
    throw new Error("Réponse de la banque d'images invalide.");
  }

  const response = value as Record<string, unknown>;
  const rawItems = response.items;
  const rawPagination = response.pagination;

  if (
    !rawItems ||
    typeof rawItems !== 'object' ||
    !rawPagination ||
    typeof rawPagination !== 'object'
  ) {
    throw new Error("Réponse de la banque d'images incomplète.");
  }

  const items: Record<string, ImageEntry> = {};
  for (const [imageId, entry] of Object.entries(rawItems)) {
    if (isImageEntry(entry)) items[imageId] = entry;
  }

  const pagination = rawPagination as Record<string, unknown>;
  const values = ['page', 'pageSize', 'totalItems', 'totalPages'].map(
    (key) => pagination[key],
  );

  if (!values.every((entry) => typeof entry === 'number')) {
    throw new Error("Pagination de la banque d'images invalide.");
  }

  return { items, pagination: pagination as ImageCatalog['pagination'] };
}
