import { Pool } from 'pg';

import { env } from '#src/config/env.js';

export class PostgreService {
  protected _pool: Pool | null = null;
  constructor() {
    if (env.IMAGE_DATABASE_URL) {
      this._pool = new Pool({
        connectionString: env.IMAGE_DATABASE_URL,
      });
    }
  }
}
