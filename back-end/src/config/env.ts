import dotenv from 'dotenv';

const envPath =
  process.env.NODE_ENV === 'test'
    ? new URL('../../.env.test', import.meta.url)
    : new URL('../../.env.dev', import.meta.url);

dotenv.config({ path: envPath, override: false });
