import type { ItemResponse } from "@/api/generated/react-query/model/itemResponse";

export type CurrentMiningClaim = {
  resourceName: string | null;
  itemId: string | null;
  quantity: number;
  value: number;
  isGlobal: boolean;
  isHof: boolean;
  isAth: boolean;
};

export type MiningClaimPayload = {
  itemId: string;
  quantity: number;
  value: number;
  isGlobal: boolean;
  isHof: boolean;
  isAth: boolean;
};

export const emptyClaim = (): CurrentMiningClaim => ({
  resourceName: null,
  itemId: null,
  quantity: 0,
  value: 0,
  isGlobal: false,
  isHof: false,
  isAth: false,
});

const resourceDeedPattern = /You received (?:Energy Matter|Ore) Resource Deed x \(\d+\) Value:/;
const claimedResourcePattern = /You have claimed a resource! \(([^)]+)\)/;
const extractionPattern = /You received (.+) x \((\d+)\) Value: ([\d.,]+) PED/;
function parsePed(value: string): number {
  const normalized = value.replace(",", ".");
  return Number(normalized);
}

function roundPed(value: number): number {
  return Math.round(value * 100) / 100;
}

export class MiningClaimParser {
  private currentClaim: CurrentMiningClaim | null = null;
  private playerName = "";

  setPlayerName(playerName: string) {
    this.playerName = playerName;
  }

  setItems(items: ItemResponse[]) {
    if (!this.currentClaim?.resourceName) return;
    this.currentClaim.itemId = items.find((item) => item.name === this.currentClaim?.resourceName)?.id ?? null;
  }

  processLine(line: string, items: ItemResponse[]): MiningClaimPayload | null {
    if (!line.includes("[System]") && !line.includes("[Globals]")) return null;
    const message = line.replace(/^.*?\[(?:System|Globals)\]\s*\[.*?\]\s*/, "").trim();

    if (resourceDeedPattern.test(message)) {
      this.currentClaim = emptyClaim();
      return null;
    }

    const claimedResource = message.match(claimedResourcePattern);
    if (claimedResource) {
      if (!this.currentClaim) return null;
      this.currentClaim.resourceName = claimedResource[1] ?? null;
      this.setItems(items);
      return null;
    }

    const escapedPlayerName = this.playerName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    const ownGlobalPattern = new RegExp(
      `^${escapedPlayerName} found a deposit \\(([^)]+)\\) with a value of ([\\d.,]+) PED(?:!| at|$)`,
    );
    const ownGlobal = this.playerName ? message.match(ownGlobalPattern) : null;
    if (ownGlobal) {
      if (!this.currentClaim) return null;
      const resourceName = ownGlobal[1];
      if (resourceName === this.currentClaim.resourceName) {
        this.currentClaim.isGlobal = true;
        this.currentClaim.isHof = message.includes("Hall of Fame");
        this.currentClaim.isAth = /ATH|all[- ]time high/i.test(message);
      }
      return null;
    }

    const extraction = message.match(extractionPattern);
    if (extraction) {
      if (!this.currentClaim || extraction[1] !== this.currentClaim.resourceName) return null;
      const quantity = Number(extraction[2]);
      const value = parsePed(extraction[3] ?? "");
      if (Number.isFinite(quantity) && Number.isFinite(value)) {
        this.currentClaim.quantity += quantity;
        this.currentClaim.value = roundPed(this.currentClaim.value + value);
      }
      return null;
    }

    if (message === "This resource is depleted") {
      if (!this.currentClaim) return null;
      this.setItems(items);
      const claim = this.currentClaim;
      if (!claim.itemId || claim.quantity <= 0 || claim.value < 0) {
        console.error("Mining claim incomplet, envoi annulé", claim);
        return null;
      }
      return {
        itemId: claim.itemId,
        quantity: claim.quantity,
        value: claim.value,
        isGlobal: claim.isGlobal,
        isHof: claim.isHof,
        isAth: claim.isAth,
      };
    }

    return null;
  }

  reset() {
    this.currentClaim = null;
  }
}
