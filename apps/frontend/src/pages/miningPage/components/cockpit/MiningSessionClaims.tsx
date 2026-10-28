import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  useGetMiningLootListApiV2SessionsMiningLootlistGet,
  useListClaimsApiV2MiningSessionIdClaimsGet,
} from '@/api/generated/react-query/entropiaManagerAPI';
import type { MiningClaimResponse } from '@/api/generated/react-query/model/miningClaimResponse';
import type { ItemViewModel } from '@zod-schemas';
import IconButton, { IconButtonIcon } from '@/shared/components/IconButton';
import MiningClaimEditModal from './MiningClaimEditModal';
import MiningClaimDepthEditModal from './MiningClaimDepthEditModal';

type MiningSessionClaimsProps = {
  sessionId: string;
  resourceNames: Record<string, string>;
  items: ItemViewModel[];
  searchType?: number | null;
};

function MiningSessionClaims({
  sessionId,
  resourceNames,
  items,
  searchType,
}: MiningSessionClaimsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const claimsQuery = useListClaimsApiV2MiningSessionIdClaimsGet(sessionId);
  const lootListQuery = useGetMiningLootListApiV2SessionsMiningLootlistGet(
    { sessionType: searchType ?? 0 },
    {
      query: {
        enabled: searchType === 1 || searchType === 2 || searchType === 3,
      },
    },
  );
  const claims: MiningClaimResponse[] = claimsQuery.data?.claims ?? [];
  const lootItemIds = new Set(
    (lootListQuery.data ?? []).map((itemId) => itemId.toLowerCase()),
  );
  const editableItems = items.filter((item) =>
    lootItemIds.has(item.id.toLowerCase()),
  );
  const displayedClaims = [...claims].sort(
    (first, second) =>
      Date.parse(second.createdAt) - Date.parse(first.createdAt),
  );

  const openClaim = (claimId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('claimId', claimId);
    params.delete('depthClaimId');
    setSearchParams(params);
  };

  const openCreateClaim = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('claimId');
    params.delete('depthClaimId');
    params.set('createClaim', 'true');
    setSearchParams(params);
  };

  const openDepthEdit = (claimId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('depthClaimId', claimId);
    params.delete('claimId');
    setSearchParams(params);
  };

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 text-base font-semibold text-text">
          Claims de la session
        </h3>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={openCreateClaim}
        >
          Créer un claim
        </Button>
      </div>
      {claimsQuery.isPending ? (
        <p className="m-0 text-sm text-text-muted">Chargement des claims...</p>
      ) : displayedClaims.length === 0 ? (
        <p className="m-0 text-sm text-text-muted">Aucun claim enregistré.</p>
      ) : (
        <div className="w-full rounded-md border border-border">
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <thead className="bg-surface-hover text-text-muted">
              <tr>
                <th className="w-[8%] px-2 py-2">#</th>
                <th className="w-[40%] px-2 py-2">Ressource</th>
                <th className="w-[18%] px-2 py-2">Taille</th>
                <th className="w-[18%] px-2 py-2 text-right">Depth</th>
                <th className="w-[16%] px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedClaims.map((claim, index) => {
                // Claims store the reference row id, not the display size number.
                const resourceName =
                  claim.item?.name ?? resourceNames[claim.id] ?? 'Unknown';
                return (
                  <tr
                    key={claim.id}
                    className={`cursor-pointer border-t border-border ${claim.depositSize === null ? 'bg-primary text-white' : 'bg-transparent text-text-muted hover:bg-surface-hover'}`}
                    tabIndex={0}
                    onClick={() => openClaim(claim.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openClaim(claim.id);
                      }
                    }}
                  >
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="break-words px-2 py-2">{resourceName}</td>
                    <td className="px-2 py-2">
                      {claim.depositSize?.romanSize ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {claim.depth ?? '-'}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <IconButton
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-md border-[var(--blue-400)] bg-[var(--blue-400)] p-0 hover:bg-[var(--blue-400)]"
                        icon={IconButtonIcon.Depth}
                        iconClassName="text-white"
                        aria-label={`Modifier la profondeur du claim ${index + 1}`}
                        title="Modifier la profondeur"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDepthEdit(claim.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <MiningClaimEditModal
        sessionId={sessionId}
        claims={displayedClaims}
        items={editableItems}
        resourceNames={resourceNames}
      />
      <MiningClaimDepthEditModal
        sessionId={sessionId}
        claims={displayedClaims}
      />
    </section>
  );
}

export default MiningSessionClaims;
