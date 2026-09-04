import { randomUUID } from 'node:crypto';

import axios from 'axios';

import type { Item } from '#prisma/generated/client.js';
import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { NexusApiItem } from '#src/types/nexusApi.js';
import type { ImageListItem } from '#src/types/scraps/wikiItem.js';
import type {
  ItemFormBody,
  ItemFormBodyWithId,
  NexusImportResult,
  NexusRequestTypeEnum,
} from '@eu/types';

import { WikiItemService } from '#src/lib/services/index.js';
import { NexusApiService } from '#src/lib/services/NexusApiService.js';
import { NexusItemMapperService } from '#src/lib/services/NexusItemMapperService.js';
import { ItemService } from '#src/lib/services/prisma/itemService.js';
import { NexusService } from '#src/lib/services/prisma/NexusService.js';

export class WikiDataToPrismaImportService {
  private _nexusItems: NexusApiItem[] = [];
  private _appItems: NexusApiItem[] = [];
  private _wikiImages: ImageListItem[] = [];
  private _nexusMapper: NexusItemMapperService = new NexusItemMapperService();

  constructor(private readonly prisma: DatabaseClient) {}

  private async getNexusItems({
    requestType,
  }: {
    requestType: NexusRequestTypeEnum;
  }): Promise<NexusApiItem[]> {
    const nas = new NexusApiService();
    if (!this._nexusItems || this._nexusItems.length === 0) {
      this._nexusItems = await nas.getItems({ requestType });
    }

    return this._nexusItems;
  }
  private async getFilteredNexusItems({
    requestType,
    nexusName,
  }: {
    requestType: NexusRequestTypeEnum;
    nexusName?: string;
  }): Promise<NexusApiItem[]> {
    const list = await this.getNexusItems({ requestType });

    const filtered = list.filter((f) => !nexusName || f.Properties?.Type === nexusName);

    return filtered;
  }
  private async getWikiImages(): Promise<ImageListItem[]> {
    const ws = new WikiItemService();
    if (!this._wikiImages || this._wikiImages.length === 0) {
      this._wikiImages = await ws.getAll({ limit: 20000, offset: 0 });
    }
    return this._wikiImages;
  }
  private async getWikiImageByName(itemName: string): Promise<ImageListItem | null> {
    const i = await this.getWikiImages();

    return i.find((img) => img.itemName === itemName) || null;
  }

  private getNullishItemUpdate(row: Item, body: ItemFormBody): Partial<ItemFormBody> {
    const update: Partial<ItemFormBody> = {};

    if (row.nexus_id === null && body.nexusId !== null) update.nexusId = body.nexusId;
    if (row.image_url_id === '' && body.imageUrlId !== undefined)
      update.imageUrlId = body.imageUrlId;
    if (row.description === null && body.description !== undefined) {
      update.description = body.description;
    }
    if (row.weight === null && body.weight !== undefined) update.weight = body.weight;
    if (row.decay === null && body.decay !== undefined) update.decay = body.decay;
    if (row.is_untradeable === null && body.isUntradeable !== undefined) {
      update.isUntradeable = body.isUntradeable;
    }
    if (row.is_rare === null && body.isRare !== undefined) update.isRare = body.isRare;

    return update;
  }

  private async getItemWithNexusFormat({ typeId }: { typeId: string }): Promise<NexusApiItem[]> {
    const is = new ItemService(this.prisma);
    const items = await is.getAll({ typeId });

    const parsed = items.map((item) => this._nexusMapper?.itemBaseToNexusFormat(item));
    const filtered = parsed.filter((item) => item !== null);

    return filtered;
  }

  async importDatasFromNexus({
    requestType,
    userId,
  }: {
    requestType: NexusRequestTypeEnum;
    userId: string;
  }): Promise<NexusImportResult> {
    const result: NexusImportResult = {
      treated: 0,
      created: 0,
      updated: 0,
      requestType: requestType,
      notFound: [],
      error: '',
    };
    try {
      const ns = new NexusService(this.prisma);

      const itemsToAdd: ItemFormBodyWithId[] = [];
      const notFoundItems: string[] = [];
      const itemNamesToAdd = new Set<string>();

      const nexusDatas = await ns.getAll({ requestType });

      if (!nexusDatas || !nexusDatas.length) {
        const error = new Error('No nexus data found for the given request type');
        Object.assign(error, { statusCode: 422 });
        throw error;
      }

      for (const e of nexusDatas) {
        const { appTypeId } = e;
        this._appItems = await this.getItemWithNexusFormat({ typeId: appTypeId });

        const valuesToInsert = await this.getFilteredNexusItems({
          requestType,
          nexusName: e.nexusName,
        });

        for (const v of valuesToInsert) {
          result.treated += 1;
          const item = this._nexusMapper.nexusFormatToItemBase({
            row: v,
            typeId: appTypeId,
            imageId: null,
          });

          if (!item) {
            continue;
          }

          const wikiData = await this.getWikiImageByName(item.name);

          if (!wikiData) {
            notFoundItems.push(item.name);
          }

          const exists = this._appItems.find((f) => f.Name === item.name);
          if (!exists && !itemNamesToAdd.has(item.name)) {
            const id = randomUUID();

            const imageUrlId = wikiData?.imageId != null ? String(wikiData.imageId) : null;

            itemsToAdd.push({
              ...item,
              id,
              imageUrlId,
            });
            itemNamesToAdd.add(item.name);
          }
        }
      }

      result.notFound = [...new Set(notFoundItems)];

      const results = await this.prisma.$transaction(async (tx) => {
        const is = new ItemService(tx);
        const items = await is.getAll();
        const existingNames = new Set(items.map((item) => item.name));

        const toCreate: { id: string }[] = [];

        for (const item of itemsToAdd) {
          if (existingNames.has(item.name)) continue;

          toCreate.push(await is.createWithId({ body: item, userId }));
          existingNames.add(item.name);
        }

        return toCreate;
      });

      result.created = results.length;

      const counts = await ns.getCounts();
      const updatedNexus = await Promise.all(
        nexusDatas.map((nexus) =>
          ns.update({
            id: nexus.id,
            body: {
              appTypeName: nexus.appTypeName,
              nexusName: nexus.nexusName ?? nexus.appTypeName,
              nexusRequestType: requestType,
            },
            counts: counts[nexus.appTypeName],
          })
        )
      );

      result.updated = updatedNexus.length;

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const importError = new Error(error.message);

        if (statusCode !== undefined) Object.assign(importError, { statusCode });

        throw importError;
      }

      if (error instanceof Error) throw error;

      throw new Error('An error occurred during the import process.');
    }
  }
}
