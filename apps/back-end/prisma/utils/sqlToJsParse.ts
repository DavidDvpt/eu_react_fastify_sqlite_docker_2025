import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type EnumMap = Record<number, string>;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlPath = join(__dirname, '../seedDatas/datas.sql');
const outDir = join(__dirname, '../seedDatas');

const ROLE_MAP: EnumMap = {
  0: 'ADMIN',
  1: 'USER',
} as const;

const LOT_TYPE_MAP: EnumMap = {
  0: 'SESSION_LINE',
  1: 'TRANSACTION',
  2: 'LOT',
} as const;

const TRANSACTION_TYPE_MAP: EnumMap = {
  0: 'BUY',
  1: 'FOUND',
  2: 'GIFT',
  3: 'EXISTING_STOCK',
  4: 'SELL',
  5: 'GIVEN',
} as const;

const TRANSACTION_STATUS_MAP: EnumMap = {
  0: 'SOLDED',
  1: 'RETURNED',
  2: 'RUNNING',
} as const;

const TABLE_MAP: Record<string, string[]> = {
  item_categories: ['id', 'date_created', 'date_updated', 'is_active', 'name'],
  '"user"': [
    'id',
    'firstname',
    'lastname',
    'pseudo',
    'password_hash',
    'role',
    'date_created',
    'date_updated',
    'is_active',
  ],
  item_types: ['id', 'category_id', 'date_created', 'date_updated', 'is_active', 'name'],
  items: [
    'id',
    'image_url_id',
    'value',
    'is_limited',
    'item_type_id',
    'date_created',
    'date_updated',
    'is_active',
    'name',
  ],
  inventory_lots: [
    'id',
    'quantity_remaining',
    'quantity_exported',
    'price_remaining',
    'item_id',
    'lot_type',
    'date_created',
    'date_updated',
    'is_active',
  ],
  transactions: [
    'id',
    'transaction_type',
    'sell_status',
    'quantity',
    'tt_value',
    'ttc_value',
    'fee',
    'date_created',
    'date_updated',
    'is_active',
    'item_id',
  ],
  inventory_lot_transactions: ['inventory_lot_id', 'transaction_id', 'quantity'],
};

function parseValues(raw: string): any[] {
  const inside = raw.substring(raw.indexOf('(') + 1, raw.lastIndexOf(')'));
  return inside
    .split(/,(?=(?:[^']|'[^']*')*$)/g)
    .map((v) => v.trim())
    .map((v) => (v.toUpperCase() === 'NULL' ? null : v.replace(/^'/, '').replace(/'$/, '')));
}

function ensureDir(path: string) {
  try {
    mkdirSync(path);
  } catch {}
}

console.log('📄 Reading SQL file:', sqlPath);
const sql = readFileSync(sqlPath, 'utf8');

const lines = sql
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l.startsWith('INSERT INTO'));
console.log(sql.split('\n'));
console.log(`➡️ Found ${lines.length} INSERT lines.`);

const dataByTable: Record<string, any[]> = {};

for (const line of lines) {
  const tableMatch = line.match(/INSERT INTO ([^\s]+) VALUES/i);
  if (!tableMatch) continue;

  const table = tableMatch[1];
  const columns = TABLE_MAP[table];
  if (!columns) continue;

  const values = parseValues(line);

  const obj: any = {};
  columns.forEach((c, i) => {
    const v = values[i];
    if (['is_active', 'is_limited'].includes(c)) {
      obj[c] = Number(v) === 1;
    } else if (c === 'role') {
      obj[c] = ROLE_MAP[Number(v)];
    } else if (c === 'lot_type') {
      obj[c] = LOT_TYPE_MAP[Number(v)];
    } else if (c === 'transaction_type') {
      obj[c] = TRANSACTION_TYPE_MAP[Number(v)];
    } else if (c === 'sell_status') {
      obj[c] = v === null ? null : TRANSACTION_STATUS_MAP[Number(v)];
    } else if (['quantity', 'quantity_remaining', 'quantity_exported'].includes(c)) {
      obj[c] = Number(v);
    } else if (['value', 'tt_value', 'ttc_value', 'fee'].includes(c)) {
      obj[c] = v === null ? null : Number(v);
    } else {
      obj[c] = v;
    }
  });

  if (!dataByTable[table]) dataByTable[table] = [];
  dataByTable[table].push(obj);
}

console.log('📝 Generating TS files...');
ensureDir(outDir);

for (const table of Object.keys(dataByTable)) {
  const safeTableName = table.replace(/"/g, '');
  const outFile = join(outDir, `${safeTableName}.ts`);
  const exportName = safeTableName.toUpperCase();

  // Type Prisma crée automatiquement : ModelNameCreateManyInput
  const modelName = safeTableName === 'user' ? 'user' : safeTableName;

  const prismaType = `Prisma.${modelName}CreateManyInput`;

  const content =
    `// Auto-generated from datas.sql\n` +
    `import type { Prisma } from "../generated/client.js";\n\n` +
    `export const ${exportName}: ${prismaType}[] = ${JSON.stringify(
      dataByTable[table],
      null,
      2
    )} as const;\n`;

  writeFileSync(outFile, content);
  console.log(`✔ ${outFile} (${dataByTable[table].length} entries)`);
}

console.log('🎉 Conversion done!');
