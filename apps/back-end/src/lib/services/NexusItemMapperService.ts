import type { NexusApiItem } from '#src/types/nexusApi.js';
import type { ItemDto, ItemFormBody } from '@eu/types';

import { env } from '#src/config/env.js';

export class NexusItemMapperService {
  cosntructor() {}

  itemBaseToNexusFormat(row: ItemDto): NexusApiItem | null {
    if (!row || row.nexusId === null) return null;

    return {
      Id: row.nexusId,
      ClassId: null,
      ItemId: row.nexusId,
      Type: null,
      SubType: null,
      Score: null,
      Name: row.name,
      Properties: {
        Description: row.description ?? null,
        Type: null,
        Weight: row.weight ?? null,
        UsesPerMinute: null,
        Efficiency: null,
        Depth: null,
        Economy: {
          MaxTT: row.value,
          MinTT: null,
          Decay: row.decay ?? null,
        },
        IsUntradeable: row.isUntradeable ?? false,
        IsRare: row.isRare ?? false,
      },
      EffectsOnEquip: null,
      Tiers: null,
      Links: null,
    };
  }
  nexusFormatToItemBase({
    imageId,
    typeId,
    row,
  }: {
    row: NexusApiItem;
    typeId: string;
    imageId: string | null;
  }): ItemFormBody | null {
    if (!row || !typeId) return null;
    const isLimited = row.Name?.endsWith('(L)') ?? false;

    const item: ItemFormBody = {
      name: row.Name,
      imageUrlId: imageId,
      value: row.Properties?.Economy?.MaxTT ?? 0,
      isLimited,
      typeId,
      isActive: true,
      nexusId: row.ItemId,
      description: row.Properties?.Description ?? null,
      weight: row.Properties?.Weight ?? null,
      decay: row.Properties?.Economy?.Decay ?? null,
      isUntradeable: row.Properties?.IsUntradeable ?? false,
      isRare: row.Properties?.IsRare ?? false,
    };

    return item;
  }
}
