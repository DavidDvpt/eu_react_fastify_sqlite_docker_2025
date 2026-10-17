import type { ReactNode } from "react";

export type MiningClaimSnackbarData = {
  resourceName: string;
  romanSize: string;
  value: number;
  isGlobal: boolean;
  isHof: boolean;
  isAth: boolean;
};

type MiningClaimSnackbarProps = {
  claim: MiningClaimSnackbarData;
};

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">{children}</span>;
}

function MiningClaimSnackbar({ claim }: MiningClaimSnackbarProps) {
  const badges = claim.isAth ? ["Global", "HoF", "ATH"] : claim.isHof ? ["Global", "HoF"] : claim.isGlobal ? ["Global"] : [];

  return (
    <div className="fixed bottom-5 right-5 z-50 min-w-72 rounded-lg border border-border bg-surface p-4 shadow-xl" role="status">
      <div className="font-semibold text-text">Ressource extraite</div>
      <div className="mt-1 text-sm text-text-muted">
        {claim.resourceName} {claim.romanSize} — {claim.value.toFixed(2)} PED
      </div>
      {badges.length > 0 && <div className="mt-2 flex gap-1">{badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div>}
    </div>
  );
}

export default MiningClaimSnackbar;
