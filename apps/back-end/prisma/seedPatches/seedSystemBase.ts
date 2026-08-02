import argon2 from 'argon2';
import { env } from '../../src/config/env.js';
import { SeedPatchBase } from '#prisma/seedProcess/SeedPatchBase.js';
import type { RootDatabaseClient } from '#prisma/prismaClient.js';
import { categoriesSeed, itemsSeed, typesSeed } from '#prisma/seedDatas/systemDatas/index.js';

const SYSTEM_USER = env.SYSTEM_USER;
const DEV_USER = env.DEV_USER;
const ADMIN_USER = env.ADMIN_USER;

export class SeedSystemBase extends SeedPatchBase {
  patchId: string = '250101_seed_system_base';
  name: string = 'seed_system_base';

  constructor(prismaClient: RootDatabaseClient) {
    super(prismaClient);
  }

  async run() {
    const USERS = [SYSTEM_USER, DEV_USER, ADMIN_USER];
    if (!SYSTEM_USER.pseudo || !SYSTEM_USER.email || !SYSTEM_USER.password) {
      throw new Error('SYSTEM_USER_* env values are required for prod seed.');
    }

    await Promise.all(
      USERS.map(async (user) => {
        return this.prismaClient.user.create({
          data: {
            id: user.id,
            pseudo: user.pseudo,
            email: user.email,
            role: 'USER',
            password_hash: await argon2.hash(user.password),
            date_created: new Date().toISOString(),
            is_active: true,
          },
        });
      })
    );

    await this.prismaClient.category.createMany({
      data: categoriesSeed(SYSTEM_USER.id),
    });

    await this.prismaClient.type.createMany({ data: typesSeed(SYSTEM_USER.id) });

    await this.prismaClient.item.createMany({ data: itemsSeed(SYSTEM_USER.id) });

    await super.run();
  }
}
