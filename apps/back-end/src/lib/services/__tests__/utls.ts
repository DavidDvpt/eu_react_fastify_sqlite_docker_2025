import prismaClient from '../../../../prisma/prismaClient.js';

const prisma = prismaClient;

async function truncateAll(table: string) {
  if (!table) return;

  switch (table) {
    case 'user': {
      await prisma.user.deleteMany();
      break;
    }
    case 'item_type': {
      await prisma.type.deleteMany();
      break;
    }
    case 'item_category': {
      // Child table first to avoid FK violations
      await prisma.type.deleteMany();
      await prisma.category.deleteMany();
      break;
    }
    default: {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table} CASCADE;`);
    }
  }
}

export { truncateAll };
