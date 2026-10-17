import type { ItemWithStock } from "@/shared/types";
import { FormatTools } from "@/shared/tools";

type ItemDetailInfosProps = {
  item: ItemWithStock;
};

function formatDetailValue(label: string, value: number): string {
  if (label === "Avg depth") {
    return `${FormatTools.formatToDecimals(value, 1)} m`;
  }

  if (label === "ammo burn") {
    const ammoBurn = Math.trunc(value);
    return `${ammoBurn} / ${ammoBurn * 2}`;
  }

  if (label === "Use / min") {
    return String(Math.trunc(value));
  }

  if (label === "Decay") {
    return FormatTools.formatToDecimals(value, 5);
  }

  return FormatTools.formatToThreeDecimals(value);
}

function ItemDetailInfos({ item }: ItemDetailInfosProps) {
  const detailRows = [
    ["Avg depth", item.depth],
    ["ammo burn", item.ammoBurn],
    ["Efficacité", item.efficiency],
    ["Portée", item.range],
    ["Niveau de profession minimum", item.minProfessionLevel],
    ["TT minimum", item.minTt],
    ["Socket", item.socket],
    ["Outil", item.tool],
    ["Type d’item", item.itemType],
    ["Use / min", item.usePerMinute],
    ["Decay", item.decay],
    ["Nexus", item.nexusUrl],
  ].filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  return (
    <div className="grid grid-cols-2 content-start gap-x-6 px-4 text-xs">
      <div className="grid grid-cols-[auto_auto] content-start gap-x-4 gap-y-1">
        <span className="text-text">Prix unitaire</span>
        <span className="text-text-muted">
          {FormatTools.pedFormat().format(item.value)} Ped(s)
        </span>
        {detailRows.map(([label, value]) => (
          <span key={label} className="contents">
            <span className="text-text">{label}</span>
            <span className="text-text-muted">
              {label === "Nexus" ? (
                <a href={String(value)} target="_blank" rel="noreferrer">
                  {String(value)}
                </a>
              ) : typeof value === "number" ? (
                formatDetailValue(String(label), value)
              ) : (
                String(value)
              )}
            </span>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[auto_auto] content-start gap-x-4 gap-y-1">
        <span className="text-text">Weight</span>
        <span className="text-text-muted">
          {item.weight === null
            ? "-"
            : FormatTools.formatToThreeDecimals(item.weight)}
        </span>
        <span className="text-text">Untradeable</span>
        <span className="text-text-muted">
          {item.isUntradeable ? "Oui" : "Non"}
        </span>
        <span className="text-text">Rare</span>
        <span className="text-text-muted">{item.isRare ? "Oui" : "Non"}</span>
      </div>
    </div>
  );
}

export default ItemDetailInfos;
