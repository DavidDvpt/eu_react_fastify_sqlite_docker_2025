import { env } from '../src/config/env.js';
import { SeedProcess } from '#prisma/seedProcess/SeedProcess.js';
import prismaClient from '#prisma/prismaClient.js';
import { SeedDevBase } from '#prisma/seedPatches/seedDevBase.js';
import { SeedSystemBase } from '#prisma/seedPatches/seedSystemBase.js';
import type { SeedPatchType } from '#prisma/seedProcess/SeedPatchBase.js';

const shouldSeedDevData = env.SEED_INCLUDE_DEV_DATA || env.NODE_ENV !== 'production';

const seedPatches: SeedPatchType[] = [new SeedSystemBase(prismaClient)];

if (shouldSeedDevData) seedPatches.push(new SeedDevBase(prismaClient));

const seedProcess = new SeedProcess(prismaClient);
await seedProcess.init();

await seedProcess.runPatches(seedPatches);
