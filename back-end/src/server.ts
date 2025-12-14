import { buildApp } from './buildApp.js'; // extension OBLIGATOIRE en NodeNext

async function start() {
  const app = buildApp();

  try {
    await app.listen({
      port: 8020,
      host: '0.0.0.0',
    });

    console.log('🚀 API running at http://localhost:8020');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

await start();
