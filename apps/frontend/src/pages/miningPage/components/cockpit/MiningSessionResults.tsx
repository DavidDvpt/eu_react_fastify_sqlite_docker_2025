import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { ItemViewModel } from "@zod-schemas";
import MiningResultCard from "./MiningResultCard";
import MiningResultItemOption from "./MiningResultItemOption";

type MiningSessionResultsProps = {
  items: ItemViewModel[];
  searchType?: number | null;
};

type MiningResult = {
  itemId: string;
  quantity: number;
};

function isMiningResource(item: ItemViewModel, searchType?: number | null) {
  const typeName = item.type?.name.toLowerCase() ?? "";
  const categoryName = item.type?.category?.name.toLowerCase() ?? "";
  const isOre = typeName.includes("ore") || categoryName.includes("ore");
  const isEnmatter =
    typeName.includes("enmatter") || categoryName.includes("enmatter");

  if (searchType === 1) return isEnmatter;
  if (searchType === 2) return isOre;
  if (searchType === 3) return isOre || isEnmatter;
  return false;
}

function MiningSessionResults({
  items,
  searchType,
}: MiningSessionResultsProps) {
  const [results, setResults] = useState<MiningResult[]>([]);
  const [query, setQuery] = useState("");
  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );
  const resourceItems = useMemo(
    () =>
      items
        .filter((item) => isMiningResource(item, searchType))
        .filter((item) =>
          item.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .sort((left, right) => left.name.localeCompare(right.name))
        .slice(0, 4),
    [items, query, searchType],
  );

  const addResult = (item: ItemViewModel) => {
    setResults((currentResults) =>
      currentResults.some((result) => result.itemId === item.id)
        ? currentResults
        : [...currentResults, { itemId: item.id, quantity: 0 }],
    );
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setResults((currentResults) =>
      currentResults.map((result) =>
        result.itemId === itemId ? { ...result, quantity } : result,
      ),
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
        <div className="grid gap-2 md:grid-cols-2">
          {results.map((result) => {
            const item = itemById.get(result.itemId);
            if (!item) return null;
            return (
              <MiningResultCard
                key={result.itemId}
                item={item}
                quantity={result.quantity}
                onQuantityChange={(quantity) =>
                  updateQuantity(result.itemId, quantity)
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
