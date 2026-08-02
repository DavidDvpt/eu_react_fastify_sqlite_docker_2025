import type { RootDatabaseClient } from '#prisma/prismaClient.js';
import {
  lotSeed,
  transactionBuySeed,
  transactionLotBuySeed,
  transactionLotSellSeed,
  transactionSellSeed,
} from '#prisma/seedDatas/devDatas/index.js';
import { LOTS_RAW } from '#prisma/seedDatas/devDatas/lotsRaw.js';
import { TRANSACTION_BUY_RAW } from '#prisma/seedDatas/devDatas/transactionBuyRaw.js';
import {
  TRANSACTION_LOT_BUY_RAW,
  TRANSACTION_LOT_SELL_RAW,
} from '#prisma/seedDatas/devDatas/transactionLotRaw.js';
import { TRANSACTION_SELL_RAW } from '#prisma/seedDatas/devDatas/transactionSellRaw.js';
import { SeedPatchBase } from '#prisma/seedProcess/SeedPatchBase.js';
import { env } from '../../src/config/env.js';

const DEV_USER = env.DEV_USER;

export class SeedDevBase extends SeedPatchBase {
  patchId: string = '250101_seed_dev_base';
  name: string = 'seed_dev_base';

  constructor(prismaClient: RootDatabaseClient) {
    super(prismaClient);
  }

  async run() {
    await this.prismaClient.lot.createMany({
      data: lotSeed(DEV_USER.id),
    });

    await this.prismaClient.transaction.createMany({
      data: transactionBuySeed(DEV_USER.id),
    });

    await this.prismaClient.transaction.createMany({
      data: transactionSellSeed(DEV_USER.id),
    });

    await this.prismaClient.transactionLot.createMany({
      data: transactionLotBuySeed(),
    });

    await this.prismaClient.transactionLot.createMany({
      data: transactionLotSellSeed(),
    });

    super.run();
  }
}
