import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.resolve(__dirname, "../storage");
const GLOBAL_JSONS_DIR = path.join(STORAGE_DIR, "jsons");
const BASE_URL = "http://www.entropiawiki.com/images/gallery";
const SIZES = ["Micro", "Normal"] as const;
const DEFAULT_DELAY_MS = 1500;

type CliOptions = {
  collection?: string;
  overwrite: boolean;
  delayMs: number;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    overwrite: false,
    delayMs: DEFAULT_DELAY_MS,
  };

  argv.forEach((arg) => {
    if (arg === "--overwrite") {
      options.overwrite = true;
      return;
    }

    if (arg.startsWith("--collection=")) {
      options.collection = arg.slice("--collection=".length).trim();
      return;
    }

    if (arg.startsWith("--delay-ms=")) {
      const raw = Number(arg.slice("--delay-ms=".length).trim());
      if (Number.isInteger(raw) && raw > 0) {
        options.delayMs = raw;
      }
    }
  });

  return options;
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

type GlobalJsonEntry = {
  collection: string;
  jsonPath: string;
};

async function getGlobalJsonFiles(globalJsonsDir: string, collection?: string): Promise<GlobalJsonEntry[]> {
  if (!(await exists(globalJsonsDir))) {
    return [];
  }

  const entries = await readdir(globalJsonsDir, { withFileTypes: true });
  const globals = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith("_global.json"))
    .map((entry) => {
      const collectionName = entry.name.replace(/_global\.json$/, "");
      return {
        collection: collectionName,
        jsonPath: path.join(globalJsonsDir, entry.name),
      };
    });

  if (!collection) {
    return globals;
  }

  return globals.filter((entry) => entry.collection === collection);
}

type GlobalValueEntry = {
  key: string;
  id: number;
};

async function collectEntriesFromGlobalJson(globalJsonPath: string): Promise<GlobalValueEntry[]> {
  const idsWithKeys = new Map<number, string>();
  const content = await readFile(globalJsonPath, "utf8");
  const parsed = JSON.parse(content) as Record<string, unknown>;

  Object.entries(parsed).forEach(([key, value]) => {
    const id = Number(value);
    if (Number.isInteger(id) && id > 0) {
      if (!idsWithKeys.has(id)) {
        idsWithKeys.set(id, key);
      }
    }
  });

  const entries = [...idsWithKeys.entries()].map(([id, key]) => ({ id, key }));
  const label = path.basename(globalJsonPath);
  console.log(`[scan] ${label}: ids=${entries.length}`);
  return entries;
}

type DownloadJob = {
  key: string;
  id: number;
  size: (typeof SIZES)[number];
  targetFile: string;
};

type FailedDownload = {
  key: string;
  id: number;
  size: (typeof SIZES)[number];
  url: string;
  reason: "missing" | "error";
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function downloadAndWrite(job: DownloadJob): Promise<"ok" | "missing" | "error"> {
  const url = `${BASE_URL}/${job.id}${job.size}.jpg`;

  try {
    const response = await fetch(url);
    if (response.status === 404) {
      return "missing";
    }
    if (!response.ok) {
      return "error";
    }

    const bytes = await response.arrayBuffer();
    await writeFile(job.targetFile, Buffer.from(bytes));
    return "ok";
  } catch {
    return "error";
  }
}

async function writeFailedDownloadsReport(
  globalJsonPath: string,
  collectionName: string,
  failures: FailedDownload[]
): Promise<void> {
  const targetPath = path.join(path.dirname(globalJsonPath), `${collectionName}_failed_downloads.json`);
  const payload = {
    generatedAt: new Date().toISOString(),
    count: failures.length,
    failures,
  };
  await writeFile(targetPath, JSON.stringify(payload, null, 2), "utf8");
}

async function processCollection(entry: GlobalJsonEntry, options: CliOptions): Promise<void> {
  const collectionName = entry.collection;
  const collectionDir = path.join(STORAGE_DIR, collectionName);

  const sourceEntries = await collectEntriesFromGlobalJson(entry.jsonPath);
  if (sourceEntries.length === 0) {
    console.log(`[skip] ${collectionName}: no ids found in ${path.basename(entry.jsonPath)}`);
    return;
  }

  await mkdir(collectionDir, { recursive: true });

  const jobs: DownloadJob[] = [];
  let alreadyPresent = 0;
  for (const sourceEntry of sourceEntries) {
    for (const size of SIZES) {
      const targetFile = path.join(collectionDir, `${sourceEntry.id}${size}.jpg`);
      if (!options.overwrite && (await exists(targetFile))) {
        alreadyPresent += 1;
        continue;
      }
      jobs.push({ key: sourceEntry.key, id: sourceEntry.id, size, targetFile });
    }
  }

  let ok = 0;
  let missing = 0;
  let error = 0;
  const failures: FailedDownload[] = [];
  const totalJobs = jobs.length;

  console.log(
    `[start] ${collectionName}: ids=${sourceEntries.length}, existing=${alreadyPresent}, queued=${totalJobs}, delay=${options.delayMs}ms`
  );

  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    const result = await downloadAndWrite(job);
    if (result === "ok") ok += 1;
    if (result === "missing") {
      missing += 1;
      failures.push({
        key: job.key,
        id: job.id,
        size: job.size,
        url: `${BASE_URL}/${job.id}${job.size}.jpg`,
        reason: "missing",
      });
    }
    if (result === "error") {
      error += 1;
      failures.push({
        key: job.key,
        id: job.id,
        size: job.size,
        url: `${BASE_URL}/${job.id}${job.size}.jpg`,
        reason: "error",
      });
    }

    const progress = `${index + 1}/${totalJobs}`;
    console.log(
      `[progress] ${collectionName} ${progress} id=${job.id} size=${job.size} result=${result}`
    );

    if (index < jobs.length - 1) {
      await sleep(options.delayMs);
    }
  }

  await writeFailedDownloadsReport(entry.jsonPath, collectionName, failures);

  console.log(
    `[done] ${collectionName}: ids=${sourceEntries.length}, existing=${alreadyPresent}, queued=${jobs.length}, downloaded=${ok}, missing=${missing}, errors=${error}`
  );
  console.log(
    `[report] ${collectionName}: ${path.join(path.dirname(entry.jsonPath), `${collectionName}_failed_downloads.json`)}`
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const globalJsonEntries = await getGlobalJsonFiles(GLOBAL_JSONS_DIR, options.collection);

  if (globalJsonEntries.length === 0) {
    console.log(
      `[info] no *_global.json found in ${GLOBAL_JSONS_DIR}${options.collection ? ` for collection=${options.collection}` : ""}`
    );
    return;
  }

  for (const entry of globalJsonEntries) {
    await processCollection(entry, options);
  }
}

main().catch((error) => {
  console.error("[fatal]", error);
  process.exit(1);
});
