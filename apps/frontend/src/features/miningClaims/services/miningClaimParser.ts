import type { ItemResponse } from '@/api/generated/react-query/model/itemResponse';

export type MiningResourceType = 'ore' | 'enmatter';

export type CurrentMiningClaim = {
  trackingId: number;
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
  trackingId: number;
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
  trackingId: 0,
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
  private readonly toExtract: CurrentMiningClaim[] = [];
  private readonly discoveryClaims: CurrentMiningClaim[] = [];
  private nextTrackingId = 1;
  private playerName = '';

  setPlayerName(playerName: string) {
    this.playerName = playerName;
  }

  setItems(items: ItemResponse[], targetClaim?: CurrentMiningClaim) {
    const claim = targetClaim ?? this.currentClaim;
    if (!claim?.resourceName || !claim.resourceType)
      return;
    const resourceName = claim.resourceName;
    const resourceType = claim.resourceType;
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
    claim.itemId =
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
      const claim = this.discoveryClaims.find(
        (candidate) => !candidate.resourceType && candidate.resourceName,
      ) ?? emptyClaim();
      claim.resourceType = resourceType;
      if (!this.discoveryClaims.includes(claim)) {
        this.discoveryClaims.push(claim);
      }
      if (claim.resourceName) {
        this.setItems(items, claim);
        return this.registerDiscoveredClaim(claim);
      }
      return null;
    }

    const claimedResource = message.match(claimedResourcePattern);
    if (claimedResource) {
      const claim =
        this.discoveryClaims.find((candidate) => !candidate.resourceName) ??
        emptyClaim();
      claim.resourceName = claimedResource[1] ?? null;
      if (!this.discoveryClaims.includes(claim)) {
        this.discoveryClaims.push(claim);
      }
      if (!claim.resourceType) return null;
      this.setItems(items, claim);
      return this.registerDiscoveredClaim(claim);
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
      const claim = this.findClaim(resourceName);
      if (!claim) return null;
      claim.isGlobal = true;
      claim.isHof = message.includes('Hall of Fame');
      claim.isAth = /ATH|all[- ]time high/i.test(message);
      return this.toEvent('claim-updated', claim);
    }

    const extraction = message.match(extractionPattern);
    if (extraction) {
      const resourceName = extraction[1] ?? '';
      if (!this.currentClaim) this.activateClaim(resourceName);
      if (!this.currentClaim || resourceName !== this.currentClaim.resourceName)
        return null;
      const quantity = Number(extraction[2]);
      const value = parsePed(extraction[3] ?? '');
      if (Number.isFinite(quantity) && Number.isFinite(value)) {
        this.currentClaim.quantity += quantity;
        this.currentClaim.value = roundPed(this.currentClaim.value + value);
        return this.toEvent('claim-updated', this.currentClaim);
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
      return this.toEvent('claim-depleted', this.currentClaim);
    }

    return null;
  }

  reset() {
    this.currentClaim = null;
    this.discoveryClaims.length = 0;
    this.toExtract.length = 0;
    this.nextTrackingId = 1;
  }

  resetActiveClaim() {
    if (!this.currentClaim) return;
    const index = this.toExtract.indexOf(this.currentClaim);
    if (index >= 0) this.toExtract.splice(index, 1);
    this.currentClaim = null;
  }

  private activateClaim(resourceName: string) {
    const claim = this.toExtract.find(
      (candidate) =>
        candidate.resourceName === resourceName &&
        candidate.resourceType !== null,
    );
    if (claim) this.currentClaim = claim;
  }

  private findClaim(resourceName: string) {
    if (this.currentClaim?.resourceName === resourceName) {
      return this.currentClaim;
    }
    return this.toExtract.find((claim) => claim.resourceName === resourceName);
  }

  private registerDiscoveredClaim(claim: CurrentMiningClaim): MiningClaimParserEvent {
    claim.trackingId = this.nextTrackingId++;
    const discoveryIndex = this.discoveryClaims.indexOf(claim);
    if (discoveryIndex >= 0) this.discoveryClaims.splice(discoveryIndex, 1);
    this.toExtract.push(claim);
    console.log('Source trouvée', claim.resourceName);
    return this.toEvent('claim-detected', claim);
  }

  private toEvent(
    type: MiningClaimParserEvent['type'],
    claim: CurrentMiningClaim,
  ): MiningClaimParserEvent {
    return { type, payload: this.toPayload(claim) };
  }

  private toPayload(source?: CurrentMiningClaim): MiningClaimPayload {
    const claim = source ?? this.currentClaim ?? emptyClaim();
    return {
      trackingId: claim.trackingId,
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
