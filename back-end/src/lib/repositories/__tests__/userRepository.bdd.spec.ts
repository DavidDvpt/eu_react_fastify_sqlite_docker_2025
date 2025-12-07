import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import prismaClient from "../../../../prisma/prismaClient.js";
import { UserRepository } from "../userRepository.js";
import { baseUser } from "./mock.js";

const prisma = prismaClient;
const repo = new UserRepository(prisma);

async function truncateAll() {
  // "user" est un mot clé SQL, on le quote
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "user" CASCADE;');
}

beforeAll(async () => {
  await truncateAll();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await truncateAll();
});

describe("UserRepository CRUD", () => {
  it("creates and reads a user", async () => {
    const created = await repo.create({ data: baseUser() });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.pseudo).toBe(created.pseudo);
  });

  it("updates a user", async () => {
    const created = await repo.create({ data: baseUser() });
    const updated = await repo.update({
      where: { id: created.id },
      data: { lastname: "Updated" },
    });

    expect(updated.lastname).toBe("Updated");
  });

  it("deletes a user", async () => {
    const created = await repo.create({ data: baseUser() });
    await repo.delete({ where: { id: created.id } });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found).toBeNull();
  });

  it("lists users", async () => {
    await repo.create({ data: baseUser() });
    await repo.create({ data: baseUser() });

    const all = await repo.findMany();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
