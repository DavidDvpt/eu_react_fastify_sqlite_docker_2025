import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from './generated/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fichier SQL
const sqlPath = join(__dirname, 'seedDatas', 'datas.sql');
const rawSql = readFileSync(sqlPath, 'utf8');

// Découper tous les statements en un tableau
let statements = rawSql
  .split(';')
  .map((s) => s.trim())
  .filter((s) => s.length > 0)
  .map((s) => s + ';'); // remettre le ;

console.log(`📄 Loaded ${statements.length} SQL statements`);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// BATCH de 200
const BATCH_SIZE = 200;

async function executeBatch(batch: any, index: any) {
  for (const stmt of batch) {
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch (err) {
      console.error(`❌ Error at batch ${index}, statement:`);
      console.error(stmt.slice(0, 200));
      throw err;
    }
  }
  console.log(`✓ Batch ${index} executed (${batch.length} statements)`);
}

async function main() {
  console.log(`🌱 Starting SQL seed with batch size ${BATCH_SIZE}...`);

  let batchIndex = 1;
  for (let i = 0; i < statements.length; i += BATCH_SIZE) {
    const batch = statements.slice(i, i + BATCH_SIZE);
    await executeBatch(batch, batchIndex++);
  }

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
