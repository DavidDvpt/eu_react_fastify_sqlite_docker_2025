import type { ReactNode } from "react";

export type MiningClaimSnackbarData = {
  type: "detected" | "depleted";
  resourceName: string;
  romanSize?: string;
  value?: number;
  isGlobal?: boolean;
  isHof?: boolean;
  isAth?: boolean;
};

type MiningClaimSnackbarProps = {
  claim: MiningClaimSnackbarData;
};

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-error-500 px-3 py-1 text-sm font-semibold text-white">{children}</span>;
}

function MiningClaimSnackbar({ claim }: MiningClaimSnackbarProps) {
  if (claim.type === "detected") {
    return (
      <div className="fixed bottom-[100px] left-1/2 z-50 flex w-[800px] max-w-[80vw] -translate-x-1/2 items-center gap-2 overflow-x-auto whitespace-nowrap rounded-lg border border-border bg-primary p-4 text-white shadow-xl" role="status">
        <span className="font-semibold text-white">Nouveau claim :</span>
        <span className="text-sm text-white">{claim.resourceName}</span>
      </div>
    );
  }
  const badges = claim.isAth ? ["Global", "HoF", "ATH"] : claim.isHof ? ["Global", "HoF"] : claim.isGlobal ? ["Global"] : [];

  return (
    <div className="fixed bottom-[100px] left-1/2 z-50 flex w-[800px] max-w-[80vw] -translate-x-1/2 items-center gap-2 overflow-x-auto whitespace-nowrap rounded-lg border border-border bg-primary p-4 text-white shadow-xl" role="status">
      <span className="font-semibold text-white">Ressource extraite :</span>
      <span className="text-sm text-white">
        {claim.resourceName} {claim.romanSize} — {claim.value?.toFixed(2)} PED
      </span>
      {badges.length > 0 && <div className="flex shrink-0 gap-1">{badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div>}
    </div>
  );
}

export default MiningClaimSnackbar;
