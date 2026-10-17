import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  useCreateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesPost,
  useFinalizeMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesLineIdFinalizePost,
  useGetMiningLootListApiV2SessionsMiningLootlistGet,
  useUpdateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesLineIdPut,
} from "@/api/generated/react-query/entropiaManagerAPI";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { ItemViewModel } from "@zod-schemas";
import MiningResultCard from "./MiningResultCard";
import MiningResultItemOption from "./MiningResultItemOption";

type MiningSessionResultsProps = {
  sessionId: string;
  items: ItemViewModel[];
  searchType?: number | null;
  resultLines?: Array<{
    id: string;
    itemId: string;
    quantity: number | null;
    isFinalized?: boolean;
  }>;
};

type MiningResult = {
  clientId: string;
  itemId: string;
  quantity: number;
  lineId?: string;
  isFinalized?: boolean;
};

function MiningSessionResults({
  sessionId,
  items,
  searchType,
  resultLines,
}: MiningSessionResultsProps) {
  const [results, setResults] = useState<MiningResult[]>(() =>
    (resultLines ?? []).map((line) => ({
      clientId: line.id,
      itemId: line.itemId,
      quantity: line.quantity ?? 0,
      lineId: line.id,
      isFinalized: line.isFinalized,
    })),
  );
  const [query, setQuery] = useState("");
  const createMutation = useCreateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesPost();
  const updateMutation = useUpdateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesLineIdPut();
  const finalizeMutation = useFinalizeMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesLineIdFinalizePost();
  const lootListQuery = useGetMiningLootListApiV2SessionsMiningLootlistGet(
    { sessionType: searchType ?? 0 },
    {
      query: {
        enabled: searchType === 1 || searchType === 2 || searchType === 3,
      },
    },
  );

  useEffect(() => {
    if (!resultLines?.length || results.length > 0) return;
    setResults(
      resultLines.map((line) => ({
        clientId: line.id,
        itemId: line.itemId,
        quantity: line.quantity ?? 0,
        lineId: line.id,
        isFinalized: line.isFinalized,
      })),
    );
  }, [resultLines, results.length]);
  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );
  const resourceItems = useMemo(
    () => {
      const lootItemIds = new Set(
        (lootListQuery.data ?? []).map((itemId) => itemId.toLowerCase()),
      );

      return items
        .filter((item) => item.isActive)
        .filter((item) => lootItemIds.has(item.id.toLowerCase()))
        .filter((item) =>
          item.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .sort((left, right) => left.name.localeCompare(right.name))
        .slice(0, 4);
    },
    [items, lootListQuery.data, query],
  );

  const addResult = (item: ItemViewModel) => {
    setResults((currentResults) => [
      ...currentResults,
      { clientId: crypto.randomUUID(), itemId: item.id, quantity: 0 },
    ]);
  };

  const updateQuantity = (result: MiningResult, quantity: number) => {
    if (result.isFinalized) return;
    setResults((currentResults) =>
      currentResults.map((current) =>
        current.clientId === result.clientId ? { ...current, quantity } : current,
      ),
    );
    if (quantity <= 0) return;
    if (!result.lineId) {
      createMutation.mutate(
        { sessionId, data: { itemId: result.itemId, quantity } },
        {
          onSuccess: (line) => {
            setResults((currentResults) =>
              currentResults.map((current) =>
                current.clientId === result.clientId
                  ? { ...current, lineId: line.id, quantity: line.quantity ?? quantity }
                  : current,
              ),
            );
            void InvalidateQueryAndKeys.miningMutation();
          },
        },
      );
      return;
    }
    updateMutation.mutate(
      { sessionId, lineId: result.lineId, data: { quantity } },
      { onSuccess: () => void InvalidateQueryAndKeys.miningMutation() },
    );
  };

  const finalize = (result: MiningResult) => {
    if (!result.lineId || result.quantity <= 0) return;
    finalizeMutation.mutate(
      { sessionId, lineId: result.lineId },
      {
        onSuccess: () => {
          setResults((currentResults) =>
            currentResults.map((current) =>
              current.clientId === result.clientId ? { ...current, isFinalized: true } : current,
            ),
          );
          void InvalidateQueryAndKeys.miningMutation();
        },
      },
    );
  };

  const handleAddResult = (item: ItemViewModel) => {
    addResult(item);
    setQuery("");
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-base font-semibold">Résultats</h2>
      <div className="relative flex flex-col gap-1">
        <Input
          value={query}
          placeholder="Ajouter une ressource"
          className="font-sans !text-xs"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query.trim().length > 0 && resourceItems.length > 0 && (
          <div className="absolute left-0 top-full z-20 mt-1 max-h-40 w-1/2 overflow-y-auto rounded-none border-0 bg-input p-0">
            {resourceItems.map((item) => (
              <MiningResultItemOption
                key={item.id}
                item={item}
                onClick={() => handleAddResult(item)}
              />
            ))}
          </div>
        )}
      </div>
      {results.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {results.map((result) => {
            const item = itemById.get(result.itemId);
            if (!item) return null;
            return (
              <MiningResultCard
                key={result.clientId}
                item={item}
                quantity={result.quantity}
                onQuantityChange={(quantity) => updateQuantity(result, quantity)}
                onFinalize={() => finalize(result)}
                isFinalized={Boolean(result.isFinalized)}
                isSaving={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  finalizeMutation.isPending
                }
              />
            );
          })}
        </div>
      ) : (
        <p className="m-0 text-sm text-text-muted">Aucun résultat ajouté.</p>
      )}
    </section>
  );
}

export default MiningSessionResults;
