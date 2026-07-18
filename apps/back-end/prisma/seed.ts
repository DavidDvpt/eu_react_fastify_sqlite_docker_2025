import { seedDevData } from './seedDev.js';
import { seedSystemData } from './seedSystem.js';
import { env } from '../src/config/env.js';

const shouldSeedDevData =
  env.SEED_INCLUDE_DEV_DATA || env.NODE_ENV !== 'production';

await seedSystemData();

if (shouldSeedDevData) {
  await seedDevData();
}
