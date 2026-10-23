import { useState } from 'react';

import type { ImageEntry } from './imagesTypes';

type ImageFigureProps = {
  imageId: string;
  variants: ImageEntry;
};

function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (import.meta.env.DEV && url.startsWith('/')) {
    return `http://entropia-manager${url}`;
  }
  return url;
}

function ImageFigure({ imageId, variants }: ImageFigureProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const availableUrls = [variants.normal, variants.original, variants.micro]
    .filter(
      (url): url is string => typeof url === 'string' && url.trim().length > 0,
    )
    .map(resolveImageUrl)
    .filter((url): url is string => url !== null);
  const imageUrl = availableUrls.find((url) => url !== failedUrl) ?? null;

  const handleImageError = () => {
    if (imageUrl) setFailedUrl(imageUrl);
  };

  return (
    <figure className="m-0 flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-ambient-md">
      <div
        className="mb-2 truncate px-3 pt-3 text-center font-medium text-text"
        title={imageId}
      >
        {imageId}
      </div>
      <div className="flex h-[180px] w-full items-center justify-center bg-bg p-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Image ${imageId}`}
            loading="lazy"
            className="h-[180px] w-[180px] object-contain"
            onError={handleImageError}
          />
        ) : (
          <span className="text-sm text-text-muted">Aucune image</span>
        )}
      </div>
      <figcaption className="flex flex-col gap-2 p-3">
        <span
          className="flex flex-wrap gap-1.5"
          aria-label={`Formats disponibles pour ${imageId}`}
        >
          {(['micro', 'normal', 'original'] as const).map((variant) => (
            <span
              key={variant}
              className={
                variants[variant]
                  ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'
                  : 'rounded-full bg-surface-hover px-2 py-0.5 text-xs font-medium text-text-muted opacity-60'
              }
            >
              {variant[0].toUpperCase() + variant.slice(1)}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

export default ImageFigure;
