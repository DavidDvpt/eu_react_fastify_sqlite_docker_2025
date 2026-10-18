import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet } from "@/api/generated/react-query/entropiaManagerAPI";
import {
  useCreatePlanetZoneApiV2PlanetsZonesPost,
  useCreateMiningSessionApiV2SessionsMiningPost,
  getGetMiningSessionsApiV2SessionsMiningGetQueryKey,
  useListPlanetZonesApiV2PlanetsZonesGet,
  useListPlanetsApiV2PlanetsGet,
  usePrevalidateMiningSessionApiV2SessionsMiningPrevalidatePost,
} from "@/api/generated/react-query/entropiaManagerAPI";
import type { MiningPrevalidationResponse } from "@/api/generated/react-query/model/miningPrevalidationResponse";
import { Button } from "@/components/ui/button";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { GenericForm } from "@/shared/components/form/Genericform";
import SelectRHF from "@/shared/components/form/Select/SelectRHF";
import { ModalGeneric } from "@/shared/components";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { getItemImageUrl } from "@/shared/helpers";
import { useSystemDatas } from "@/shared/hooks";
import FinderAmplifierSelector from "./FinderAmplifierSelector";
import type { AmplifierSelection } from "./FinderAmplifierSelector";
import type { SelectedEnhancer } from "./EnhancerSockets";
import MiningAmmoSelector from "./MiningAmmoSelector";
import MiningEquipmentSelect from "./MiningEquipmentSelect";

const miningSessionFormSchema = z.object({
  clickCount: z.coerce.number().optional(),
  searchType: z.string().optional(),
  planetId: z.string().optional(),
  zoneName: z.string().trim().optional(),
  ammoItemId: z.string().optional(),
  finderLotId: z.string().optional(),
  excavatorLotId: z.string().optional(),
});

function SummaryItem({
  item,
  label,
  children,
  indent = false,
}: {
  item?: { name: string; imageUrlId: string };
  label: string;
  children?: ReactNode;
  indent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${indent ? "pl-4" : ""}`}>
      {item && (
        <ItemImage
          url={getItemImageUrl(item.imageUrlId, "normal")}
          alt={item.name}
          size="small"
          classname="shrink-0"
        />
      )}
      <span>
        {label} : <span className="text-text">{item?.name ?? "—"}</span>
      </span>
      {children && (
        <span className="ml-auto text-right text-text">{children}</span>
      )}
    </div>
  );
}

function SummaryCostItem({
  item,
  label,
  costTt,
  costTtc,
}: {
  item?: { name: string; imageUrlId: string };
  label: string;
  costTt: number;
  costTtc: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {item && (
        <ItemImage
          url={getItemImageUrl(item.imageUrlId, "normal")}
          alt={item.name}
          size="small"
          classname="shrink-0"
        />
      )}
      <span>
        {label} : <span className="text-text">{item?.name ?? "—"}</span>
      </span>
      <span className="ml-auto grid grid-cols-2 gap-4 text-right text-text">
        <span>
          {new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(
            costTt,
          )}{" "}
          PED
        </span>
        <span>
          {new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(
            costTtc,
          )}{" "}
          PED
        </span>
      </span>
    </div>
  );
}

function MiningSessionModal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const availableQuery =
    useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet();
  const prevalidateMutation =
    usePrevalidateMiningSessionApiV2SessionsMiningPrevalidatePost();
  const createSessionMutation = useCreateMiningSessionApiV2SessionsMiningPost();
  const createZoneMutation = useCreatePlanetZoneApiV2PlanetsZonesPost();
  const planetsQuery = useListPlanetsApiV2PlanetsGet();
  const {
    items: { itemDatas, isLoading: isItemsLoading },
  } = useSystemDatas();
  const [finderLotId, setFinderLotId] = useState<string>();
  const [excavatorLotId, setExcavatorLotId] = useState<string>();
  const [clickCount, setClickCount] = useState<number | undefined>(undefined);
  const [isEnmatterSelected, setIsEnmatterSelected] = useState(false);
  const [isOresSelected, setIsOresSelected] = useState(false);
  const [planetId, setPlanetId] = useState("");
  const [zoneName, setZoneName] = useState("");
  const zonesQuery = useListPlanetZonesApiV2PlanetsZonesGet(
    planetId ? { planet: planetId } : undefined,
    { query: { enabled: Boolean(planetId) } },
  );
  const [ammoSelection, setAmmoSelection] = useState<{
    itemId: string;
    quantity: number;
  }>();
  const [finderEnhancers, setFinderEnhancers] = useState<SelectedEnhancer[]>(
    [],
  );
  const [excavatorEnhancers, setExcavatorEnhancers] = useState<
    SelectedEnhancer[]
  >([]);
  const [amplifierSelection, setAmplifierSelection] =
    useState<AmplifierSelection>();
  const [showSummary, setShowSummary] = useState(false);
  const [prevalidation, setPrevalidation] =
    useState<MiningPrevalidationResponse>();
  const searchType =
    isEnmatterSelected && isOresSelected
      ? 3
      : isEnmatterSelected
        ? 1
        : isOresSelected
          ? 2
          : undefined;
  const available = availableQuery.data;
  const itemById = useMemo(
    () => new Map((itemDatas ?? []).map((item) => [item.id, item])),
    [itemDatas],
  );
  const selectedFinder = available?.finder.find(
    (lot) => lot.lotId === finderLotId,
  );
  const selectedFinderItem = selectedFinder
    ? itemById.get(selectedFinder.itemId)
    : undefined;
  const selectedExcavator = available?.excavator.find(
    (lot) => lot.lotId === excavatorLotId,
  );
  const selectedExcavatorItem = selectedExcavator
    ? itemById.get(selectedExcavator.itemId)
    : undefined;
  const formatAmount = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 3,
    }).format(value);
  const finderDecay = selectedFinderItem?.decay
    ? selectedFinderItem.decay * (searchType === 3 ? 2 : 1)
    : undefined;
  const requiredFinderTt =
    finderDecay && clickCount ? finderDecay * clickCount : undefined;
  const hasEnoughFinderTt = Boolean(
    selectedFinder &&
    requiredFinderTt !== undefined &&
    (selectedFinder.ttRemaining ?? 0) >= requiredFinderTt,
  );
  const equipmentReady = Boolean(clickCount && clickCount > 0 && searchType);
  const formReady = Boolean(
    clickCount &&
    clickCount > 0 &&
    searchType &&
    selectedFinder &&
    excavatorLotId &&
    ammoSelection &&
    finderDecay &&
    hasEnoughFinderTt &&
    Boolean(planetId) === Boolean(zoneName.trim()),
  );
  const formIssues = [
    !clickCount || clickCount <= 0 ? "Indiquez le nombre de clics." : undefined,
    !searchType ? "Sélectionnez au moins un type de mining." : undefined,
    planetId && !zoneName.trim() ? "Indiquez une zone ou retirez la planète." : undefined,
    !planetId && zoneName.trim() ? "Sélectionnez une planète pour cette zone." : undefined,
    !selectedFinder ? "Sélectionnez un finder." : undefined,
    selectedFinder && !finderDecay
      ? "Le decay du finder est indisponible."
      : undefined,
    selectedFinder && finderDecay && !hasEnoughFinderTt
      ? `TT du finder insuffisant : ${formatAmount(selectedFinder.ttRemaining ?? 0)} PED disponibles pour ${formatAmount(requiredFinderTt ?? 0)} PED nécessaires.`
      : undefined,
    !ammoSelection
      ? available?.ammo.length
        ? "Sélectionnez une munition."
        : "Aucune munition disponible dans votre inventaire."
      : undefined,
    !excavatorLotId ? "Sélectionnez un excavateur." : undefined,
  ].filter((issue): issue is string => Boolean(issue));
  const onAmmoSelectionChange = useCallback(
    (selection?: { itemId: string; quantity: number }) => {
      setAmmoSelection(selection);
    },
    [],
  );
  const onFinderEnhancersChange = useCallback(
    (enhancers: SelectedEnhancer[]) => {
      setFinderEnhancers(enhancers);
    },
    [],
  );
  const onExcavatorEnhancersChange = useCallback(
    (enhancers: SelectedEnhancer[]) => {
      setExcavatorEnhancers(enhancers);
    },
    [],
  );
  const onAmplifierSelectionChange = useCallback(
    (selection?: AmplifierSelection) => {
      setAmplifierSelection(selection);
    },
    [],
  );
  const formatPercent = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  const formatPed = (value: number) => `${formatAmount(value)} PED`;
  const selectedAmmoItem = ammoSelection
    ? itemById.get(ammoSelection.itemId)
    : undefined;
  const ammoCost = clickCount && searchType ? clickCount * 0.5 * searchType : 0;
  const ammoQuantity = selectedAmmoItem?.value
    ? Math.ceil(ammoCost / selectedAmmoItem.value)
    : 0;
  const totalTtc = prevalidation ? prevalidation.total.costTtc : 0;
  const onClose = () => navigate("/mining");
  const onPrevalidate = async (values: z.output<typeof miningSessionFormSchema>) => {
    setPlanetId(values.planetId ?? "");
    setZoneName(values.zoneName?.trim() ?? "");
    if (
      !available ||
      !clickCount ||
      !searchType ||
      !finderLotId ||
      !ammoSelection ||
      (Boolean(values.planetId) !== Boolean(values.zoneName?.trim()))
    )
      return;

    const result = await prevalidateMutation.mutateAsync({
      data: {
        clicks: clickCount,
        type: searchType,
        ammoItemId: ammoSelection.itemId,
        ammoQuantity,
        finderLotIds: [finderLotId],
        ampLotIds: amplifierSelection?.lotIds,
      },
    });
    setPrevalidation(result);
    setShowSummary(true);
  };
  const onCreateSession = async () => {
    if (
      !clickCount ||
      !searchType ||
      !finderLotId ||
      !excavatorLotId ||
      !ammoSelection
    )
      return;

    const normalizedZoneName = zoneName.trim();
    const existingZone = planetId && normalizedZoneName
      ? (zonesQuery.data ?? []).find(
          (zone) => zone.name.trim().toLocaleLowerCase() === normalizedZoneName.toLocaleLowerCase(),
        )
      : undefined;
    const zoneId = planetId && normalizedZoneName
      ? existingZone?.id ?? (await createZoneMutation.mutateAsync({
          data: { planetId, name: normalizedZoneName },
        })).id
      : undefined;

    await createSessionMutation.mutateAsync({
      data: {
        clickCount,
        searchType,
        ...(zoneId ? { zoneId } : {}),
        finderLotId,
        ammoItemId: ammoSelection.itemId,
        ammoQuantityInitial: ammoQuantity,
        amplifierLotIds: amplifierSelection?.lotIds,
        excavatorLotIds: [excavatorLotId],
        enhancers: [
          ...finderEnhancers.map((enhancer) => ({
            itemId: enhancer.itemId,
            target: "FINDER" as const,
            targetLotId: finderLotId,
            socket: enhancer.socket,
            quantityInitial: enhancer.quantity,
          })),
          ...excavatorEnhancers.map((enhancer) => ({
            itemId: enhancer.itemId,
            target: "EXCAVATOR" as const,
            targetLotId: excavatorLotId,
            socket: enhancer.socket,
            quantityInitial: enhancer.quantity,
          })),
        ],
      } as Parameters<typeof createSessionMutation.mutateAsync>[0]["data"] & { zoneId: string },
    });
    await queryClient.invalidateQueries({
      queryKey: getGetMiningSessionsApiV2SessionsMiningGetQueryKey(),
    });
    onClose();
  };

  return (
    <ModalGeneric
      dialogType="form"
      title={{ value: "Session Mining" }}
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      contentStyle="max-h-[80vh] w-[80vw] max-w-[80vw] overflow-hidden"
    >
      <GenericForm
        schema={miningSessionFormSchema}
        defaultValues={{
          clickCount: undefined,
          searchType: undefined,
          planetId: "",
          zoneName: "",
        }}
        onSubmit={onPrevalidate}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      >
        <div className="min-h-0 flex-1 overflow-y-auto pr-3">
          {!showSummary && (
            <p className="text-sm text-text-muted">
              Sélectionnez votre équipement et vos consommables pour initialiser
              une session de mining.
            </p>
          )}
          {availableQuery.isPending && (
            <div className="rounded-md border border-border p-4 text-sm text-text-muted">
              Chargement de l’inventaire disponible...
            </div>
          )}
          {availableQuery.isError && (
            <div className="rounded-md border border-error-500 p-4 text-sm text-error-300">
              Impossible de charger l’inventaire disponible.
            </div>
          )}
          {available && !showSummary && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 items-end gap-4">
                <div className="flex flex-col gap-2 px-1">
                  <label
                    htmlFor="mining-click-count"
                    className="text-sm font-medium text-text"
                  >
                    Nombre de clics
                  </label>
                  <InputRHF
                    name="clickCount"
                    id="mining-click-count"
                    type="number"
                    min={1}
                    max={9999}
                    value={clickCount ?? ""}
                    onInputChange={(event) => {
                      const value = event.currentTarget.value;
                      setClickCount(
                        value === ""
                          ? undefined
                          : Math.min(9999, Math.max(0, Number(value))),
                      );
                    }}
                    className="h-9 w-24"
                  />
                </div>
                <div className="flex flex-col gap-2 px-1">
                  <span className="text-sm font-medium text-text">Type</span>
                  <SelectRHF
                    name="searchType"
                    options={[
                      { value: "1", label: "Enmatter" },
                      { value: "2", label: "Ore" },
                      { value: "3", label: "Enmatter / Ore" },
                    ]}
                    placeholder="Sélectionner un type"
                    onValueChange={(value) => {
                      setIsEnmatterSelected(value === "1" || value === "3");
                      setIsOresSelected(value === "2" || value === "3");
                    }}
                  />
                  <span className="sr-only">
                    Type Mining : {searchType ?? "non sélectionné"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 px-1">
                  <InputRHF
                    key={`zone-${planetId}`}
                    name="zoneName"
                    label="Zone"
                    list="mining-zone-options"
                    placeholder={planetId ? "Zone connue ou nouvelle" : "Sélectionnez d'abord une planète"}
                    disabled={!planetId}
                    onInputChange={(event) => setZoneName(event.currentTarget.value)}
                  />
                  <datalist id="mining-zone-options">
                    {(zonesQuery.data ?? []).map((zone) => (
                      <option key={zone.id} value={zone.name} />
                    ))}
                  </datalist>
                </div>
                <div className="flex flex-col gap-2 px-1">
                  <SelectRHF
                    name="planetId"
                    label="Planète"
                    options={(planetsQuery.data ?? []).map((planet) => ({
                      value: planet.id,
                      label: planet.name,
                    }))}
                    placeholder="Sélectionner une planète"
                    onValueChange={(value) => {
                      setPlanetId(value);
                      setZoneName("");
                    }}
                    disabled={planetsQuery.isPending}
                  />
                </div>
              </div>
              <MiningAmmoSelector
                ammo={available.ammo}
                itemById={itemById}
                clickCount={clickCount ?? 0}
                searchType={searchType}
                disabled={isItemsLoading || !equipmentReady}
                onSelectionChange={onAmmoSelectionChange}
                name="ammoItemId"
              />
              <section className="flex flex-col gap-4 rounded-md border border-border p-4">
                <h3 className="m-0 mb-[10px] text-base font-medium text-text">
                  Session Finder
                </h3>
                <MiningEquipmentSelect
                  name="finderLotId"
                  label="Finder"
                  placeholder="Sélectionner un finder"
                  lots={available.finder}
                  itemById={itemById}
                  value={finderLotId}
                  onValueChange={setFinderLotId}
                  disabled={isItemsLoading || !equipmentReady}
                  enhancersBySocket={available.finderEnhancers}
                  target="FINDER"
                  title="Enhancers"
                  clickCount={clickCount ?? 0}
                  searchType={searchType}
                  onEnhancersChange={onFinderEnhancersChange}
                />
                <FinderAmplifierSelector
                  lots={available.finderAmplifier}
                  itemById={itemById}
                  clickCount={clickCount ?? 0}
                  searchType={searchType}
                  disabled={isItemsLoading || !equipmentReady}
                  onSelectionChange={onAmplifierSelectionChange}
                />
              </section>
              <section className="flex flex-col gap-4 rounded-md border border-border p-4">
                <h3 className="m-0 mb-[10px] text-base font-medium text-text">
                  Session Excavator
                </h3>
                <MiningEquipmentSelect
                  name="excavatorLotId"
                  label="Excavateur"
                  placeholder="Sélectionner un excavateur"
                  lots={available.excavator}
                  itemById={itemById}
                  value={excavatorLotId}
                  onValueChange={setExcavatorLotId}
                  disabled={isItemsLoading || !equipmentReady}
                  enhancersBySocket={available.excavatorEnhancers}
                  target="EXCAVATOR"
                  title="Enhancers"
                  clickCount={clickCount ?? 0}
                  searchType={searchType}
                  onEnhancersChange={onExcavatorEnhancersChange}
                />
              </section>
            </div>
          )}
          {showSummary && (
            <section className="flex flex-col gap-3 rounded-md border border-border p-4">
              <h3 className="m-0 text-base font-medium text-text">
                Récapitulatif
              </h3>
              <div className="grid gap-2 text-sm text-text-muted">
                <div>
                  Nombre de clics :{" "}
                  <span className="text-text">{clickCount}</span>
                </div>
                <div>
                  Types sélectionnés :{" "}
                  <span className="text-text">
                    {[
                      isEnmatterSelected && "Enmatter",
                      isOresSelected && "Ores",
                    ]
                      .filter(Boolean)
                      .join(" + ")}
                  </span>
                </div>
                <div>
                  Planète : <span className="text-text">{planetsQuery.data?.find((planet) => planet.id === planetId)?.name ?? "—"}</span>
                </div>
                <div>
                  Zone : <span className="text-text">{zoneName || "—"}</span>
                </div>
                {prevalidation?.ammo.map((line) => (
                  <SummaryCostItem
                    key={`ammo-${line.itemId}`}
                    item={itemById.get(line.itemId)}
                    label="Munitions"
                    costTt={line.costTt}
                    costTtc={line.costTtc}
                  />
                ))}
                {prevalidation?.finder.map((line) => (
                  <SummaryCostItem
                    key={`finder-${line.lotId}`}
                    item={itemById.get(line.itemId)}
                    label="Finder"
                    costTt={line.costTt}
                    costTtc={line.costTtc}
                  />
                ))}
                {finderEnhancers.map((enhancer) => (
                  <SummaryItem
                    key={`finder-enhancer-${enhancer.socket}`}
                    item={itemById.get(enhancer.itemId)}
                    label={`Enhancer finder · socket ${enhancer.socket}`}
                    indent
                  />
                ))}
                {prevalidation?.amp.map((line) => (
                  <SummaryCostItem
                    key={line.lotId}
                    item={itemById.get(line.itemId)}
                    label="Amplificateur"
                    costTt={line.costTt}
                    costTtc={line.costTtc}
                  />
                ))}
                <SummaryItem item={selectedExcavatorItem} label="Excavateur" />
                {excavatorEnhancers.map((enhancer) => (
                  <SummaryItem
                    key={`excavator-enhancer-${enhancer.socket}`}
                    item={itemById.get(enhancer.itemId)}
                    label={`Enhancer excavateur · socket ${enhancer.socket}`}
                    indent
                  />
                ))}
              </div>
              {prevalidateMutation.isError && (
                <div className="text-sm text-error-300">
                  Impossible de prévalider cette session.
                </div>
              )}
              {createSessionMutation.isError && (
                <div className="text-sm text-error-300">
                  Impossible de créer cette session.
                </div>
              )}
              {createZoneMutation.isError && (
                <div className="text-sm text-error-300">
                  Impossible de créer cette zone.
                </div>
              )}
              {prevalidation && (
                <table className="w-full border-collapse text-right text-sm">
                  <thead>
                    <tr className="border-b border-border text-text-muted">
                      <th className="px-2 py-2 text-left font-medium">Clics</th>
                      <th className="px-2 py-2 font-medium">TT</th>
                      <th className="px-2 py-2 font-medium">TTC</th>
                      <th className="px-2 py-2 font-medium">Clic TT</th>
                      <th className="px-2 py-2 font-medium">Clic TTC</th>
                      <th className="px-2 py-2 font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-text">
                      <td className="px-2 py-2 text-left">{clickCount}</td>
                      <td className="px-2 py-2">
                        {formatPed(prevalidation.total.costTt)}
                      </td>
                      <td className="px-2 py-2">{formatPed(totalTtc)}</td>
                      <td className="px-2 py-2">
                        {formatPed(
                          prevalidation.total.costTt / (clickCount ?? 1),
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {formatPed(totalTtc / (clickCount ?? 1))}
                      </td>
                      <td className="px-2 py-2">
                        {formatPercent(
                          (totalTtc / prevalidation.total.costTt) * 100,
                        )}
                        %
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </section>
          )}
          {!showSummary && formIssues.length > 0 && (
            <div
              className="rounded-md border border-warning-500/50 bg-warning-500/10 px-3 py-2 text-sm text-warning-200"
              role="status"
            >
              <div className="font-medium">Il manque encore :</div>
              <ul className="mt-1 list-disc pl-5">
                {formIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex shrink-0 justify-end gap-2 pt-4">
          <Button
            variant="secondary"
            className="w-[calc(120px+3rem)]"
            onClick={showSummary ? () => setShowSummary(false) : onClose}
          >
            {showSummary ? "Retour" : "Annuler"}
          </Button>
          {!showSummary ? (
            <Button
              type="submit"
              variant="primary"
              className="w-[calc(120px+3rem)]"
              disabled={!formReady || prevalidateMutation.isPending}
            >
              {prevalidateMutation.isPending ? "Validation..." : "Valider"}
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-[calc(120px+3rem)]"
              disabled={createSessionMutation.isPending || createZoneMutation.isPending || zonesQuery.isPending}
              onClick={onCreateSession}
            >
              {createSessionMutation.isPending || createZoneMutation.isPending ? "Création..." : "Valider"}
            </Button>
          )}
        </div>
      </GenericForm>
    </ModalGeneric>
  );
}

export default MiningSessionModal;
