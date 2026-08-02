import { env } from '../src/config/env.js';
import { SeedProcess } from '#prisma/seedProcess/SeedProcess.js';
import prismaClient from '#prisma/prismaClient.js';
import type { SeedPatchType } from '#prisma/seedProcess/SeedPatchBase.js';

const shouldSeedDevData = env.SEED_INCLUDE_DEV_DATA || env.NODE_ENV !== 'production';

const seedPatches: SeedPatchType[] = [];

if (shouldSeedDevData) seedPatches.push();

const seedProcess = new SeedProcess(prismaClient);
await seedProcess.init();

seedProcess.runPatches(seedPatches);
