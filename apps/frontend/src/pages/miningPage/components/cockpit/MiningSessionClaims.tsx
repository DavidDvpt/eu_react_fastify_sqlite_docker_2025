import { useSearchParams } from "react-router-dom";
import {
  useGetMiningLootListApiV2SessionsMiningLootlistGet,
  useListClaimsApiV2MiningSessionIdClaimsGet,
} from "@/api/generated/react-query/entropiaManagerAPI";
import type { MiningClaimResponse } from "@/api/generated/react-query/model/miningClaimResponse";
import type { MiningDepositSizeResponse } from "@/api/generated/react-query/model/miningDepositSizeResponse";
import type { ItemViewModel } from "@zod-schemas";
import MiningClaimEditModal from "./MiningClaimEditModal";

type MiningSessionClaimsProps = {
  sessionId: string;
  itemById: Map<string, ItemViewModel>;
  depositSizes: MiningDepositSizeResponse[];
  resourceNames: Record<string, string>;
  items: ItemViewModel[];
  searchType?: number | null;
};

function formatValue(value: string | null) {
  if (value === null) return "—";
  return `${Number(value).toFixed(2)} PED`;
}

function MiningSessionClaims({
  sessionId,
  itemById,
  depositSizes,
  resourceNames,
  items,
  searchType,
}: MiningSessionClaimsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const claimsQuery = useListClaimsApiV2MiningSessionIdClaimsGet(sessionId);
  const lootListQuery = useGetMiningLootListApiV2SessionsMiningLootlistGet(
    { sessionType: searchType ?? 0 },
    { query: { enabled: searchType === 1 || searchType === 2 || searchType === 3 } },
  );
  const claims: MiningClaimResponse[] = claimsQuery.data?.claims ?? [];
  const lootItemIds = new Set((lootListQuery.data ?? []).map((itemId) => itemId.toLowerCase()));
  const editableItems = items.filter((item) => lootItemIds.has(item.id.toLowerCase()));
  const fakeClaims: MiningClaimResponse[] = [
    {
      id: "__fake-claim-open__",
      sessionId,
      itemId: editableItems[0]?.id ?? null,
      quantity: 1250,
      isHof: false,
      isGlobal: true,
      value: "42.50",
      depositSize: null,
      latitude: null,
      longitude: null,
      depth: null,
    },
    {
      id: "__fake-claim-depleted__",
      sessionId,
      itemId: editableItems[0]?.id ?? null,
      quantity: 800,
      isHof: false,
      isGlobal: false,
      value: "18.75",
      depositSize: 3,
      latitude: null,
      longitude: null,
      depth: null,
    },
  ];
  const displayedClaims = import.meta.env.DEV ? [...fakeClaims, ...claims] : claims;

  const openClaim = (claimId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("claimId", claimId);
    setSearchParams(params);
  };

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h3 className="m-0 text-base font-semibold text-text">Claims de la session</h3>
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
                <th className="w-[35%] px-2 py-2">Ressource</th>
                <th className="w-[17%] px-2 py-2">Taille</th>
                <th className="w-[40%] px-2 py-2 text-right">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {displayedClaims.map((claim, index) => {
                // Claims store the reference row id, not the display size number.
                const size = depositSizes.find((entry) => entry.id === claim.depositSize);
                const resourceName = claim.itemId
                  ? itemById.get(claim.itemId)?.name ?? resourceNames[claim.id] ?? "Unknown"
                  : resourceNames[claim.id] ?? "Unknown";
                return (
                  <tr
                    key={claim.id}
                    className={`cursor-pointer border-t border-border ${claim.depositSize === null ? "bg-primary text-white" : "bg-transparent text-text-muted hover:bg-surface-hover"}`}
                    tabIndex={0}
                    onClick={() => openClaim(claim.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openClaim(claim.id);
                      }
                    }}
                  >
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="break-words px-2 py-2">{resourceName}</td>
                    <td className="px-2 py-2">{size?.romanSize ?? "—"}</td>
                    <td className="px-2 py-2 text-right">{formatValue(claim.value)}</td>
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
        depositSizes={depositSizes}
      />
    </section>
  );
}

export default MiningSessionClaims;
