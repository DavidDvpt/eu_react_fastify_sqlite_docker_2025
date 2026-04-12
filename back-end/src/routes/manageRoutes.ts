import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import {
  buildStorageImageIndex,
  getDefaultStorageIndexPath,
  loadStorageImageIndex,
  writeStorageImageIndex,
} from '../lib/storageImageIndex.js';

import type { FastifyPluginCallback } from 'fastify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.resolve(__dirname, '../../storage');
const STORAGE_INDEX_PATH = getDefaultStorageIndexPath(STORAGE_DIR);

let microImageIndexPromise: Promise<Map<string, string>> | null = null;
let normalImageIndexPromise: Promise<Map<string, string>> | null = null;

function toAbsoluteMicroIndexMap(micro: Record<string, string>): Map<string, string> {
  return new Map(
    Object.entries(micro).map(([id, relativePath]) => [id, path.join(STORAGE_DIR, relativePath)])
  );
}

function toAbsoluteNormalIndexMap(normal: Record<string, string>): Map<string, string> {
  return new Map(
    Object.entries(normal).map(([id, relativePath]) => [id, path.join(STORAGE_DIR, relativePath)])
  );
}

async function rebuildAndPersistMicroImageIndex(): Promise<Map<string, string>> {
  const built = await buildStorageImageIndex(STORAGE_DIR);
  await writeStorageImageIndex(STORAGE_DIR, built, STORAGE_INDEX_PATH);
  return toAbsoluteMicroIndexMap(built.micro);
}

async function rebuildAndPersistNormalImageIndex(): Promise<Map<string, string>> {
  const built = await buildStorageImageIndex(STORAGE_DIR);
  await writeStorageImageIndex(STORAGE_DIR, built, STORAGE_INDEX_PATH);
  return toAbsoluteNormalIndexMap(built.normal);
}

async function loadMicroImageIndex(): Promise<Map<string, string>> {
  try {
    const index = await loadStorageImageIndex(STORAGE_DIR, STORAGE_INDEX_PATH);
    return toAbsoluteMicroIndexMap(index.micro);
  } catch {
    return rebuildAndPersistMicroImageIndex();
  }
}

async function loadNormalImageIndex(): Promise<Map<string, string>> {
  try {
    const index = await loadStorageImageIndex(STORAGE_DIR, STORAGE_INDEX_PATH);
    return toAbsoluteNormalIndexMap(index.normal);
  } catch {
    return rebuildAndPersistNormalImageIndex();
  }
}

function getMicroImageIndex(): Promise<Map<string, string>> {
  if (!microImageIndexPromise) {
    microImageIndexPromise = loadMicroImageIndex();
  }
  return microImageIndexPromise;
}

function getNormalImageIndex(): Promise<Map<string, string>> {
  if (!normalImageIndexPromise) {
    normalImageIndexPromise = loadNormalImageIndex();
  }
  return normalImageIndexPromise;
}

const categoryCreateSchema = z.object({
  name: z.string().min(1),
  is_active: z.boolean().optional(),
});

const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

const typeCreateSchema = z.object({
  name: z.string().min(1),
  category_id: z.string().min(1),
  is_active: z.boolean().optional(),
  supports_limited: z.boolean().optional(),
  is_stackable: z.boolean().optional(),
});

const typeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category_id: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
  supports_limited: z.boolean().optional(),
  is_stackable: z.boolean().optional(),
});

const itemCreateSchema = z.object({
  name: z.string().min(1),
  image_url_id: z.string(),
  value: z.coerce.number(),
  is_limited: z.boolean(),
  is_stackable: z.boolean().optional(),
  item_type_id: z.string().min(1),
  is_active: z.boolean().optional(),
});

const itemUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image_url_id: z.string().optional(),
  value: z.coerce.number().optional(),
  is_limited: z.boolean().optional(),
  is_stackable: z.boolean().optional(),
  item_type_id: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

const includeQuerySchema = z.object({
  include: z.string().optional(),
});

function shouldIncludeParent(query: unknown): boolean {
  const parsed = includeQuerySchema.safeParse(query);
  if (!parsed.success) {
    return false;
  }

  const include = parsed.data.include;
  if (!include) {
    return false;
  }

  return include
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .includes('parent');
}

const manageRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.get('/storage/images/:id/micro', async (request, reply) => {
    const params = request.params as { id: string };
    if (!/^\d+$/.test(params.id)) {
      return reply.code(400).send({ message: 'Invalid image id' });
    }

    let imageIndex = await getMicroImageIndex();
    let filePath = imageIndex.get(params.id);

    if (!filePath) {
      microImageIndexPromise = rebuildAndPersistMicroImageIndex();
      imageIndex = await microImageIndexPromise;
      filePath = imageIndex.get(params.id);
    }

    if (!filePath) {
      return reply.code(404).send({ message: 'Image not found' });
    }

    const fileBuffer = await readFile(filePath);
    return reply.type('image/jpeg').send(fileBuffer);
  });

  app.get('/storage/images/:id/normal', async (request, reply) => {
    const params = request.params as { id: string };
    if (!/^\d+$/.test(params.id)) {
      return reply.code(400).send({ message: 'Invalid image id' });
    }

    let imageIndex = await getNormalImageIndex();
    let filePath = imageIndex.get(params.id);

    if (!filePath) {
      normalImageIndexPromise = rebuildAndPersistNormalImageIndex();
      imageIndex = await normalImageIndexPromise;
      filePath = imageIndex.get(params.id);
    }

    if (!filePath) {
      return reply.code(404).send({ message: 'Image not found' });
    }

    const fileBuffer = await readFile(filePath);
    return reply.type('image/jpeg').send(fileBuffer);
  });

  app.protect();

  app.get('/categories', async (request, reply) => {
    const rows = await app.repos.itemCategories.findMany(undefined, request.user.id);
    return reply.code(200).send(rows);
  });

  app.get('/categories/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await app.repos.itemCategories.findUnique(
      { where: { id: params.id } },
      request.user.id
    );

    if (!row) return reply.code(404).send({ message: 'Category not found' });

    return reply.code(200).send(row);
  });

  app.post('/categories', async (request, reply) => {
    const body = categoryCreateSchema.parse(request.body);
    const now = new Date().toISOString();
    const created = await app.repos.itemCategories.create({
      data: {
        name: body.name,
        is_active: body.is_active ?? true,
        date_created: now,
        date_updated: null,
        user_id: request.user.id,
      },
    });
    return reply.code(201).send(created);
  });

  app.put('/categories/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = categoryUpdateSchema.parse(request.body);
      const updated = await app.repos.itemCategories.update(
        {
          where: { id: params.id },
          data: { ...body, date_updated: new Date().toISOString() },
        },
        request.user.id
      );
      return reply.code(200).send(updated);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  app.get('/types', async (request, reply) => {
    const includeParent = shouldIncludeParent(request.query);
    const rows = await app.repos.itemTypes.findMany(
      includeParent
        ? {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }
        : undefined,
      request.user.id
    );
    return reply.code(200).send(rows);
  });

  app.get('/types/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await app.repos.itemTypes.findUnique({ where: { id: params.id } }, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Type not found' });

    return reply.code(200).send(row);
  });

  app.post('/types', async (request, reply) => {
    const body = typeCreateSchema.parse(request.body);
    const now = new Date().toISOString();
    const created = await app.repos.itemTypes.create({
      data: {
        name: body.name,
        category_id: body.category_id,
        is_active: body.is_active ?? true,
        supports_limited: body.supports_limited ?? false,
        is_stackable: body.is_stackable ?? false,
        date_created: now,
        date_updated: null,
        user_id: request.user.id,
      },
    });
    return reply.code(201).send(created);
  });

  app.put('/types/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = typeUpdateSchema.parse(request.body);
      const updated = await app.repos.itemTypes.update(
        {
          where: { id: params.id },
          data: { ...body, date_updated: new Date().toISOString() },
        },
        request.user.id
      );
      return reply.code(200).send(updated);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  app.get('/items', async (request, reply) => {
    const includeParent = shouldIncludeParent(request.query);
    const rows = await app.repos.items.findMany(
      includeParent
        ? {
            include: {
              item_type: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }
        : undefined,
      request.user.id
    );
    return reply.code(200).send(rows);
  });

  app.get('/items/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await app.repos.items.findUnique({ where: { id: params.id } }, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(row);
  });

  app.post('/items', async (request, reply) => {
    const body = itemCreateSchema.parse(request.body);
    const now = new Date().toISOString();
    const created = await app.repos.items.create({
      data: {
        name: body.name,
        image_url_id: body.image_url_id,
        value: body.value,
        is_limited: body.is_limited,
        is_stackable: body.is_stackable ?? true,
        item_type_id: body.item_type_id,
        is_active: body.is_active ?? true,
        date_created: now,
        date_updated: null,
        user_id: request.user.id,
      },
    });
    return reply.code(201).send(created);
  });

  app.put('/items/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = itemUpdateSchema.parse(request.body);
      const updated = await app.repos.items.update(
        {
          where: { id: params.id },
          data: { ...body, date_updated: new Date().toISOString() },
        },
        request.user.id
      );
      return reply.code(200).send(updated);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  done();
};

export default manageRoutes;
