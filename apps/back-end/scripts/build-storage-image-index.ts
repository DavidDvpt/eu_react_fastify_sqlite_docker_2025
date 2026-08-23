// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

// import {
//   buildStorageImageIndex,
//   getDefaultStorageIndexPath,
//   writeStorageImageIndex,
// } from '../src/lib/storageImageIndex.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const STORAGE_DIR = path.resolve(__dirname, '../storage');

// async function main() {
//   const index = await buildStorageImageIndex(STORAGE_DIR);
//   const indexPath = getDefaultStorageIndexPath(STORAGE_DIR);
//   await writeStorageImageIndex(STORAGE_DIR, index, indexPath);

//   const microCount = Object.keys(index.micro).length;
//   const normalCount = Object.keys(index.normal).length;
//   console.log(
//     `[done] index written: ${indexPath} (micro=${microCount}, normal=${normalCount}, generatedAt=${index.generatedAt})`
//   );
// }

// main().catch((error) => {
//   console.error('[fatal]', error);
//   process.exit(1);
// });
export {};
