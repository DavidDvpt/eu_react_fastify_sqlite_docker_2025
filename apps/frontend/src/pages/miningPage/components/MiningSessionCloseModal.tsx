import { useEffect, useMemo, useState } from "react";
import { SessionType } from "@/api/generated/model";
import {
  getGetMiningSessionsApiV2SessionsMiningGetQueryKey,
  useCloseSessionApiV2SessionsSessionIdPatch,
  useGetCurrentSessionApiV2SessionsCurrentGet,
  useGetMiningSessionDetailApiV2SessionsMiningSessionIdDetailGet,
} from "@/api/generated/react-query/entropiaManagerAPI";
import { useQueryClient } from "@tanstack/react-query";
import type { MiningCostLineResponse } from "@/api/generated/react-query/model/miningCostLineResponse";
import type { MiningCurrentSessionResponse } from "@/api/generated/react-query/model/miningCurrentSessionResponse";
import type { MiningResultLineResponse } from "@/api/generated/react-query/model/miningResultLineResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalGeneric } from "@/shared/components";
import { Section } from "@/shared/components/Containers";
import IconButton, { IconButtonIcon } from "@/shared/components/IconButton";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { getItemImageUrl, NumberHelper } from "@/shared/helpers";
import { useSystemDatas } from "@/shared/hooks";
import type { ItemViewModel } from "@zod-schemas";

type DraftValue = { quantity?: number; decay?: number };

function asNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function format(value: number | string | null | undefined) {
  return NumberHelper.formatNumber(asNumber(value) ?? 0);
}

function formatTotal(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(value);
}

function itemName(item: ItemViewModel | undefined, fallback?: string | null | undefined) {
  return item?.name ?? fallback ?? "Inconnu";
}

function MiningSessionCloseModal({
  open,
  onOpenChange,
  sessionId,
  readOnly = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId?: string;
  readOnly?: boolean;
}) {
  const currentQuery = useGetCurrentSessionApiV2SessionsCurrentGet(
    { type: SessionType.MINING },
    { query: { retry: false, enabled: open && !readOnly } },
  );
  const detailQuery = useGetMiningSessionDetailApiV2SessionsMiningSessionIdDetailGet(
    sessionId ?? "",
    { query: { retry: false, enabled: open && readOnly && Boolean(sessionId) } },
  );
  const closeMutation = useCloseSessionApiV2SessionsSessionIdPatch();
  const queryClient = useQueryClient();
  const {
    items: { itemDatas },
  } = useSystemDatas();
  const sessionData = readOnly ? detailQuery.data : currentQuery.data;
  const session = sessionData && "finderItemId" in sessionData
    ? sessionData as MiningCurrentSessionResponse
    : undefined;
  const items = useMemo(() => new Map((itemDatas ?? []).map((item) => [item.id, item])), [itemDatas]);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, DraftValue>>({});
  const [dirtyLines, setDirtyLines] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open || !session) return;
    setEditing(false);
    setDrafts({});
    setDirtyLines(new Set());
  }, [open, session?.id, readOnly]);

  const results = session?.resultLines ?? [];
  const costs = session?.costLines ?? [];
  const finderEnhancerIds = new Set(
    Object.values(session?.finderEnhancers ?? {}).map((line) => line.itemId),
  );
  const excavatorEnhancerIds = new Set(
    Object.values(session?.excavatorEnhancers ?? {}).map((line) => line.itemId),
  );
  const finderCosts = costs.filter((line) => line.isFinder && !line.isEnhancer);
  const amplifierCosts = costs.filter((line) => line.isAmplifier && !line.isEnhancer);
  const fullTtAmplifierCosts = amplifierCosts.filter((line) => {
    const itemValue = items.get(line.itemId ?? "")?.value ?? 0;
    return itemValue > 0 && (asNumber(line.decay) ?? 0) >= itemValue;
  });
  const partialAmplifierCosts = amplifierCosts.filter((line) => !fullTtAmplifierCosts.includes(line));
  const excavatorCosts = costs.filter((line) => line.isExcavator && !line.isEnhancer);
  const enhancerCosts = costs.filter((line) => {
    if (!line.isEnhancer) return false;
    return finderEnhancerIds.has(line.itemId ?? "") || excavatorEnhancerIds.has(line.itemId ?? "");
  });
  const ammoCosts = costs.filter((line) => !line.isFinder && !line.isAmplifier && !line.isExcavator && !line.isEnhancer);

  const valueForResult = (line: MiningResultLineResponse) => {
    const quantity = drafts[line.id]?.quantity ?? line.quantity ?? 0;
    return quantity * (items.get(line.itemId)?.value ?? 0);
  };

  const valueForCost = (line: MiningCostLineResponse) => {
    if (line.isFinder || line.isAmplifier || line.isExcavator) {
      return asNumber(drafts[line.id]?.decay ?? line.decay) ?? 0;
    }

    const quantity = drafts[line.id]?.quantity ?? line.quantity ?? 0;
    return quantity * (items.get(line.itemId ?? "")?.value ?? 0);
  };

  const totalResults = results.reduce((total, line) => total + valueForResult(line), 0);
  const totalCosts = costs.reduce((total, line) => total + valueForCost(line), 0);

  const updateDraft = (line: MiningCostLineResponse | MiningResultLineResponse, value: DraftValue) => {
    setDrafts((current) => ({ ...current, [line.id]: { ...current[line.id], ...value } }));
    setDirtyLines((current) => new Set(current).add(line.id));
  };

  const updateNumber = (line: MiningCostLineResponse | MiningResultLineResponse, field: "quantity" | "decay", value: string) => {
    const parsed = value === "" ? undefined : Number(value);
    if (parsed !== undefined && !Number.isFinite(parsed)) return;
    updateDraft(line, { [field]: parsed });
  };

  const hasEdits = !readOnly && (editing || dirtyLines.size > 0);

  const inputValue = (line: MiningCostLineResponse | MiningResultLineResponse, field: "quantity" | "decay") => {
    const draftValue = drafts[line.id]?.[field];
    if (draftValue !== undefined) return draftValue;
    return field === "quantity" ? line.quantity ?? "" : asNumber(line.decay) ?? "";
  };

  const closeSession = () => {
    if (!session || readOnly) return;
      const data = hasEdits
      ? {
          lines: [...dirtyLines].map((lineId) => {
            const line = [...results, ...costs].find((candidate) => candidate.id === lineId);
            const draft = drafts[lineId] ?? {};
            return {
              lineId,
              ...(line && "itemId" in line && line.type === "RESULT" ? { quantity: draft.quantity ?? line.quantity ?? 0 } : {}),
              ...(line && "isFinder" in line ? {
                ...(draft.quantity !== undefined ? { quantity: draft.quantity } : {}),
                ...(draft.decay !== undefined ? { decay: draft.decay } : {}),
              } : {}),
            };
          }),
        }
      : undefined;
    closeMutation.mutate(
      { sessionId: session.id, ...(data ? { data } : {}) },
      {
        onSuccess: async () => {
          await InvalidateQueryAndKeys.miningMutation();
          await queryClient.invalidateQueries({
            queryKey: getGetMiningSessionsApiV2SessionsMiningGetQueryKey(),
          });
          onOpenChange(false);
        },
      },
    );
  };

  const renderCostLine = (
    line: MiningCostLineResponse,
    label: string,
    editable: "decay" | "quantity" | "none",
    alwaysEditable = false,
    displayValue?: number,
  ) => (
    <div key={line.id} className={`grid items-center gap-3 border-b border-border py-2 last:border-b-0 ${editable === "quantity" ? "grid-cols-[minmax(0,1fr)_7rem_7rem]" : "grid-cols-[minmax(0,1fr)_7rem]"}`}>
      <div className="flex min-w-0 items-center gap-2">
        {items.get(line.itemId ?? "") && (
          <ItemImage
            url={getItemImageUrl(items.get(line.itemId ?? "")!.imageUrlId, "normal")}
            alt={itemName(items.get(line.itemId ?? ""), line.itemId)}
            size="small"
            classname="h-8 w-8 shrink-0"
          />
        )}
        <div className="min-w-0">
        <div className="truncate text-sm text-text">{label}</div>
        </div>
      </div>
      {editable === "none" ? (
        <span className="w-full text-right text-sm text-text">{format(displayValue ?? line.quantity)}{line.quantity !== null ? " PED" : "—"}</span>
      ) : (
        <>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputValue(line, editable)}
            disabled={readOnly || (!editing && !alwaysEditable) || closeMutation.isPending}
            readOnly={readOnly || (!editing && !alwaysEditable)}
            onChange={(event) => updateNumber(line, editable, event.target.value)}
            className="h-8 w-full text-right text-sm"
          />
          {editable === "quantity" && (
            <span className="w-full text-right text-sm font-semibold text-text">
              {format((asNumber(inputValue(line, "quantity")) ?? 0) * (items.get(line.itemId ?? "")?.value ?? 0))} PED
            </span>
          )}
        </>
      )}
    </div>
  );

  return (
    <ModalGeneric
      dialogType="form"
      open={open}
      onOpenChange={onOpenChange}
      title={{ value: readOnly ? "Détail de la session Mining" : "Clore la session Mining" }}
      contentStyle="flex max-h-[90vh] w-[min(900px,calc(100vw-2rem))] max-w-none flex-col overflow-hidden"
    >
        {(readOnly ? detailQuery.isPending : currentQuery.isPending) && <div className="text-sm text-text-muted">Chargement du récapitulatif…</div>}
        {(readOnly ? detailQuery.isError : currentQuery.isError) && <div className="text-sm text-error-300">Impossible de charger le récapitulatif.</div>}
        {session && (
          <div className="grid min-h-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Section className="min-h-0 overflow-hidden">
              <h3 className="mb-2 text-sm font-semibold text-text">Cost</h3>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {ammoCosts.map((line) => renderCostLine(line, `Ammo — ${itemName(items.get(line.itemId ?? ""), line.itemId)}`, "none", false, (line.quantity ?? 0) * (items.get(line.itemId ?? "")?.value ?? 0)))}
                {finderCosts.map((line) => renderCostLine(line, `Decay finder — ${itemName(items.get(line.itemId ?? ""), line.itemId)}`, "decay"))}
                {fullTtAmplifierCosts.map((line) => renderCostLine(line, `Decay amp (TT complet) — ${itemName(items.get(line.itemId ?? ""), line.itemId)}`, "decay"))}
                {partialAmplifierCosts.map((line) => renderCostLine(line, `Decay amp — ${itemName(items.get(line.itemId ?? ""), line.itemId)}`, "decay"))}
                {enhancerCosts.map((line) => renderCostLine(line, `${finderEnhancerIds.has(line.itemId ?? "") ? "Enhancer finder" : "Enhancer excavateur"} — ${itemName(items.get(line.itemId ?? ""), line.itemId)}`, "quantity"))}
                {excavatorCosts.map((line) => renderCostLine(line, `Decay excavateur — ${itemName(items.get(line.itemId ?? ""), line.itemId)}`, "decay", true))}
              </div>
            </Section>
            <Section className="min-h-0 overflow-hidden">
              <h3 className="mb-2 text-sm font-semibold text-text">Result</h3>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {results.map((line) => {
                  const item = items.get(line.itemId);
                  const finalized = Boolean(line.isFinalized);
                  return (
                    <div key={line.id} className="grid grid-cols-[minmax(0,1fr)_7rem_7rem] items-center gap-3 border-b border-border py-2 last:border-b-0">
                      <span className="flex min-w-0 items-center gap-2 truncate text-sm text-text">
                        {item && <ItemImage url={getItemImageUrl(item.imageUrlId, "normal")} alt={item.name} size="small" classname="h-8 w-8 shrink-0" />}
                        <span className="truncate">{itemName(item, line.itemId)}{finalized ? " (finalisé)" : ""}</span>
                      </span>
                      {finalized ? <span className="w-full text-right text-sm text-text">{format(line.quantity)}</span> : <Input type="number" min={1} value={inputValue(line, "quantity")} disabled={readOnly || !editing || closeMutation.isPending} readOnly={readOnly || !editing} onChange={(event) => updateNumber(line, "quantity", event.target.value)} className="h-8 w-full text-right text-sm" />}
                      <span className="w-full text-right text-sm font-semibold text-text">{format(valueForResult(line))} PED</span>
                    </div>
                  );
                })}
                <div className="mt-2 flex flex-col gap-1 border-t border-border pt-3 text-sm font-semibold text-text">
                  <div className="flex justify-between gap-3">
                    <span>Total coûts</span>
                    <span>{formatTotal(totalCosts)} PED</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Total résultats</span>
                    <span>{formatTotal(totalResults)} PED</span>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-border pt-1">
                    <span>Différence (résultats - coûts)</span>
                    <span>{formatTotal(totalResults - totalCosts)} PED</span>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}
        <div className="flex flex-row justify-end gap-2 pt-2">
          {!readOnly && !editing && <IconButton type="button" variant="secondary" icon={IconButtonIcon.Edit} aria-label="Modifier le récapitulatif" title="Modifier" onClick={() => setEditing(true)} />}
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={closeMutation.isPending}>{readOnly ? "Fermer" : "Annuler"}</Button>
          {!readOnly && <Button type="button" variant="primary" onClick={closeSession} disabled={!session || closeMutation.isPending}>{closeMutation.isPending ? "Clôture…" : hasEdits ? "Enregistrer et clore" : "Clore la session"}</Button>}
        </div>
    </ModalGeneric>
  );
}

export default MiningSessionCloseModal;
