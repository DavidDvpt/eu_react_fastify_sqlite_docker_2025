import argon2 from 'argon2';
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
    if (!DEV_USER.id || !DEV_USER.pseudo || !DEV_USER.email || !DEV_USER.password) {
      throw new Error('DEV_DATA_USER_* env values are required when SEED_INCLUDE_DEV_DATA=true.');
    }

    await this.prismaClient.user.create({
      data: {
        id: DEV_USER.id,
        pseudo: DEV_USER.pseudo,
        email: DEV_USER.email,
        role: 'USER',
        password_hash: await argon2.hash(DEV_USER.password),
        date_created: new Date().toISOString(),
        is_active: true,
      },
    });

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

    await super.run();
  }
}
