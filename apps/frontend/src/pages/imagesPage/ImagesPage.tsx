import { useMemo, useState } from 'react';

import { useListImagesApiV2ImagesGet } from '@/api/generated/react-query/entropiaManagerAPI';
import { Button } from '@/components/ui/button';
import { CapsuleLoader } from '@/shared/components';
import { Panel, Section } from '@/shared/components/Containers';

import ImageFigure from './ImageFigure';
import { parseImageCatalog } from './imagesTypes';

const PAGE_SIZE_OPTIONS = [50, 100, 150, 200, 250, 300];

function ImagesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(300);
  const query = useListImagesApiV2ImagesGet(
    { page, pageSize },
    { query: { staleTime: 60_000 } },
  );
  const catalog = useMemo(
    () => (query.data ? parseImageCatalog(query.data) : null),
    [query.data],
  );
  const totalPages = Math.max(1, catalog?.pagination.totalPages ?? 1);

  const changePage = (amount: number) => {
    setPage((current) => Math.min(totalPages, Math.max(1, current + amount)));
  };

  const changePageSize = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
  };

  return (
    <Panel className="min-h-0 gap-2 p-2">
      <Section className="flex-row items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-xl font-semibold text-text">
            Banque d’images
          </h1>
          <p className="m-0 text-sm text-text-muted">
            {catalog?.pagination.totalItems ?? 0} image(s) référencée(s)
          </p>
        </div>
        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-900">
          Admin
        </span>
      </Section>

      <Section className="min-h-0 flex-1 overflow-y-auto">
        {query.isLoading ? (
          <CapsuleLoader title="Chargement des images..." />
        ) : query.isError ? (
          <p className="m-0 text-sm text-error-500">
            Impossible de charger la banque d’images.
          </p>
        ) : catalog && Object.keys(catalog.items).length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
            {Object.entries(catalog.items).map(([imageId, variants]) => (
              <ImageFigure
                key={imageId}
                imageId={imageId}
                variants={variants}
              />
            ))}
          </div>
        ) : (
          <p className="m-0 text-sm text-text-muted">
            Aucune image disponible.
          </p>
        )}
      </Section>

      <Section className="flex-row flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-text-muted">
          Images par page
          <select
            value={pageSize}
            onChange={(event) => changePageSize(event.target.value)}
            className="h-9 rounded-md border border-border bg-input px-2 text-text"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => changePage(-5)}
            disabled={page <= 1}
          >
            −5
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={page <= 1}
          >
            −1
          </Button>
          <span className="min-w-24 text-center text-sm text-text">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => changePage(1)}
            disabled={page >= totalPages}
          >
            +1
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => changePage(5)}
            disabled={page >= totalPages}
          >
            +5
          </Button>
        </div>
      </Section>
    </Panel>
  );
}

export default ImagesPage;
