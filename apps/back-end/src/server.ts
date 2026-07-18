import { buildApp } from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

async function start() {
  const app = buildApp({});

  try {
    await app.listen({
      port: PORT,
      host: '0.0.0.0',
    });

    console.log('🚀 API running at http://localhost:8020');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

await start();
