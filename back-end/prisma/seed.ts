import { seedDevData } from './seedDev.js';
import { seedSystemData } from './seedSystem.js';

const shouldSeedDevData =
  process.env.SEED_INCLUDE_DEV_DATA === 'true' || process.env.NODE_ENV !== 'production';

await seedSystemData();

if (shouldSeedDevData) {
  await seedDevData();
}
