import type { ItemResponse } from '@/api/generated/react-query/model/itemResponse';

export type MiningResourceType = 'ore' | 'enmatter';

export type CurrentMiningClaim = {
  resourceName: string | null;
  resourceType: MiningResourceType | null;
  itemId: string | null;
  quantity: number;
  value: number;
  isGlobal: boolean;
  isHof: boolean;
  isAth: boolean;
};

export type MiningClaimPayload = {
  resourceName: string;
  resourceType: MiningResourceType;
  itemId: string;
  quantity: number;
  value: number;
  isGlobal: boolean;
  isHof: boolean;
  isAth: boolean;
};

export type MiningClaimParserEvent =
  | { type: 'claim-detected'; payload: MiningClaimPayload }
  | { type: 'claim-updated'; payload: MiningClaimPayload }
  | { type: 'claim-depleted'; payload: MiningClaimPayload };

export const emptyClaim = (): CurrentMiningClaim => ({
  resourceName: null,
  resourceType: null,
  itemId: null,
  quantity: 0,
  value: 0,
  isGlobal: false,
  isHof: false,
  isAth: false,
});

const resourceDeedPattern =
  /You received (Energy Matter|Mineral) Resource Deed x \(\d+\) Value:/;
const claimedResourcePattern = /You have claimed a resource! \(([^)]+)\)/;
const extractionPattern = /You received (.+) x \((\d+)\) Value: ([\d.,]+) PED/;
function parsePed(value: string): number {
  const normalized = value.replace(',', '.');
  return Number(normalized);
}

function roundPed(value: number): number {
  return Math.round(value * 100) / 100;
}

export class MiningClaimParser {
  private currentClaim: CurrentMiningClaim | null = null;
  private readonly claims = new Map<MiningResourceType, CurrentMiningClaim>();
  private playerName = '';

  setPlayerName(playerName: string) {
    this.playerName = playerName;
  }

  setItems(items: ItemResponse[]) {
    if (!this.currentClaim?.resourceName || !this.currentClaim.resourceType)
      return;
    const resourceName = this.currentClaim.resourceName;
    const resourceType = this.currentClaim.resourceType;
    const matchingItems = items.filter(
      (item) => item.name === resourceName,
    );
    const typedItem = matchingItems.find((item) => {
      const itemTypeName = item.type?.name?.toLowerCase() ?? '';
      const categoryName = item.type?.category?.name?.toLowerCase() ?? '';
      const itemType = item.itemType?.toLowerCase() ?? '';
      const miningTypeName = `${itemTypeName} ${categoryName} ${itemType}`;
      const isEnmatter =
        miningTypeName.includes('enmatter') ||
        miningTypeName.includes('energy matter');
      const isOre =
        miningTypeName.includes('ore') || miningTypeName.includes('mineral');
      return resourceType === 'enmatter'
        ? isEnmatter
        : isOre;
    });
    this.currentClaim.itemId =
      typedItem?.id ??
      (matchingItems.length === 1 ? (matchingItems[0]?.id ?? null) : null);
  }

  processLine(
    line: string,
    items: ItemResponse[],
  ): MiningClaimParserEvent | null {
    if (!line.includes('[System]') && !line.includes('[Globals]')) return null;
    const message = line
      .replace(/^.*?\[(?:System|Globals)\]\s*\[.*?\]\s*/, '')
      .trim();

    const resourceDeed = message.match(resourceDeedPattern);
    if (resourceDeed) {
      const resourceType: MiningResourceType =
        resourceDeed[1] === 'Energy Matter' ? 'enmatter' : 'ore';
      if (this.currentClaim && !this.currentClaim.resourceType) {
        this.currentClaim.resourceType = resourceType;
        this.claims.set(resourceType, this.currentClaim);
      } else {
        this.currentClaim = this.claims.get(resourceType) ?? emptyClaim();
        this.currentClaim.resourceType = resourceType;
        this.claims.set(resourceType, this.currentClaim);
      }
      if (this.currentClaim.resourceName) {
        this.setItems(items);
        console.log('Source trouvée', this.currentClaim.resourceName);
        return { type: 'claim-detected', payload: this.toPayload() };
      }
      return null;
    }

    const claimedResource = message.match(claimedResourcePattern);
    if (claimedResource) {
      this.currentClaim ??= emptyClaim();
      this.currentClaim.resourceName = claimedResource[1] ?? null;
      if (!this.currentClaim.resourceType) return null;
      this.claims.set(this.currentClaim.resourceType, this.currentClaim);
      this.setItems(items);
      console.log('Source trouvée', this.currentClaim.resourceName);
      return { type: 'claim-detected', payload: this.toPayload() };
    }

    const escapedPlayerName = this.playerName.replace(
      /[.*+?^${}()|[\\]\\]/g,
      '\\$&',
    );
    const ownGlobalPattern = new RegExp(
      `^${escapedPlayerName} found a deposit \\(([^)]+)\\) with a value of ([\\d.,]+) PED(?:!| at|$)`,
    );
    const ownGlobal = this.playerName ? message.match(ownGlobalPattern) : null;
    if (ownGlobal) {
      const resourceName = ownGlobal[1];
      this.activateClaim(resourceName);
      if (!this.currentClaim) return null;
      if (resourceName === this.currentClaim.resourceName) {
        this.currentClaim.isGlobal = true;
        this.currentClaim.isHof = message.includes('Hall of Fame');
        this.currentClaim.isAth = /ATH|all[- ]time high/i.test(message);
        return { type: 'claim-updated', payload: this.toPayload() };
      }
      return null;
    }

    const extraction = message.match(extractionPattern);
    if (extraction) {
      this.activateClaim(extraction[1] ?? '');
      if (
        !this.currentClaim ||
        extraction[1] !== this.currentClaim.resourceName
      )
        return null;
      const quantity = Number(extraction[2]);
      const value = parsePed(extraction[3] ?? '');
      if (Number.isFinite(quantity) && Number.isFinite(value)) {
        this.currentClaim.quantity += quantity;
        this.currentClaim.value = roundPed(this.currentClaim.value + value);
        return { type: 'claim-updated', payload: this.toPayload() };
      }
      return null;
    }

    if (message === 'This resource is depleted') {
      if (!this.currentClaim) return null;
      console.log('Source depleted', this.currentClaim);
      this.setItems(items);
      const claim = this.currentClaim;
      if (!claim.resourceName || claim.quantity <= 0 || claim.value < 0) {
        console.error('Mining claim incomplet, envoi annulé', claim);
        return null;
      }
      return { type: 'claim-depleted', payload: this.toPayload() };
    }

    return null;
  }

  reset() {
    this.currentClaim = null;
    this.claims.clear();
  }

  resetActiveClaim() {
    if (!this.currentClaim?.resourceType) return;
    this.claims.delete(this.currentClaim.resourceType);
    this.currentClaim = null;
  }

  private activateClaim(resourceName: string) {
    const claim = [...this.claims.values()].find(
      (candidate) => candidate.resourceName === resourceName,
    );
    if (claim) this.currentClaim = claim;
  }

  private toPayload(): MiningClaimPayload {
    const claim = this.currentClaim ?? emptyClaim();
    return {
      resourceName: claim.resourceName ?? 'Unknown',
      resourceType: claim.resourceType ?? 'ore',
      itemId: claim.itemId ?? '',
      quantity: claim.quantity,
      value: claim.value,
      isGlobal: claim.isGlobal,
      isHof: claim.isHof,
      isAth: claim.isAth,
    };
  }
}
