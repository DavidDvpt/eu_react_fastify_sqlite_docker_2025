import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.resolve(__dirname, "../storage");
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

async function getCollectionDirs(root: string, collection?: string): Promise<string[]> {
  if (collection) {
    return [path.join(root, collection)];
  }

  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name));
}

async function collectIdsFromJsonsDir(jsonsDir: string): Promise<Set<number>> {
  const ids = new Set<number>();
  const entries = await readdir(jsonsDir, { withFileTypes: true });
  const jsonFiles = entries.filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      !entry.name.startsWith("failed_downloads")
  );

  for (const jsonFile of jsonFiles) {
    const fullPath = path.join(jsonsDir, jsonFile.name);
    const content = await readFile(fullPath, "utf8");
    const parsed = JSON.parse(content) as Record<string, unknown>;

    Object.values(parsed).forEach((value) => {
      const id = Number(value);
      if (Number.isInteger(id) && id > 0) {
        ids.add(id);
      }
    });
  }

  console.log(`[scan] ${path.basename(path.dirname(jsonsDir))}: json files=${jsonFiles.length}, ids=${ids.size}`);
  return ids;
}

type DownloadJob = {
  id: number;
  size: (typeof SIZES)[number];
  targetFile: string;
};

type FailedDownload = {
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
  jsonsDir: string,
  failures: FailedDownload[]
): Promise<void> {
  const targetPath = path.join(jsonsDir, "failed_downloads.json");
  const payload = {
    generatedAt: new Date().toISOString(),
    count: failures.length,
    failures,
  };
  await writeFile(targetPath, JSON.stringify(payload, null, 2), "utf8");
}

async function processCollection(collectionDir: string, options: CliOptions): Promise<void> {
  const jsonsDir = path.join(collectionDir, "jsons");
  const collectionName = path.basename(collectionDir);

  if (!(await exists(jsonsDir))) {
    console.log(`[skip] ${collectionName}: no jsons directory`);
    return;
  }

  const ids = await collectIdsFromJsonsDir(jsonsDir);
  if (ids.size === 0) {
    console.log(`[skip] ${collectionName}: no ids found in json files`);
    return;
  }

  await mkdir(collectionDir, { recursive: true });

  const jobs: DownloadJob[] = [];
  for (const id of ids) {
    for (const size of SIZES) {
      const targetFile = path.join(collectionDir, `${id}${size}.jpg`);
      if (!options.overwrite && (await exists(targetFile))) {
        continue;
      }
      jobs.push({ id, size, targetFile });
    }
  }

  let ok = 0;
  let missing = 0;
  let error = 0;
  const failures: FailedDownload[] = [];
  const totalJobs = jobs.length;

  console.log(`[start] ${collectionName}: downloading ${totalJobs} images (delay=${options.delayMs}ms)`);

  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    const result = await downloadAndWrite(job);
    if (result === "ok") ok += 1;
    if (result === "missing") {
      missing += 1;
      failures.push({
        id: job.id,
        size: job.size,
        url: `${BASE_URL}/${job.id}${job.size}.jpg`,
        reason: "missing",
      });
    }
    if (result === "error") {
      error += 1;
      failures.push({
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

  await writeFailedDownloadsReport(jsonsDir, failures);

  console.log(
    `[done] ${collectionName}: ids=${ids.size}, queued=${jobs.length}, downloaded=${ok}, missing=${missing}, errors=${error}`
  );
  console.log(`[report] ${collectionName}: ${path.join(jsonsDir, "failed_downloads.json")}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const collectionDirs = await getCollectionDirs(STORAGE_DIR, options.collection);

  if (collectionDirs.length === 0) {
    console.log("[info] no collection directory found");
    return;
  }

  for (const collectionDir of collectionDirs) {
    await processCollection(collectionDir, options);
  }
}

main().catch((error) => {
  console.error("[fatal]", error);
  process.exit(1);
});
