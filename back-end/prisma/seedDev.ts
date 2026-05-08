import { UserRepository } from '../src/lib/repositories/index.js';
import prismaClient from './prismaClient.js';
import { LOTS } from './seedDatas/lots.js';
import { SESSIONS_BUY, SESSION_BUY_LINES } from './seedDatas/session_buy.js';
import { SESSIONS_SELL, SESSION_SELL_LINES } from './seedDatas/session_sell.js';
import { USERS } from './seedDatas/user.js';

const userRepository = new UserRepository(prismaClient);
const DEFAULT_DATA_USER_ID = process.env.DEV_DATA_USER_ID;

const seedDevData = async () => {
  const usersCount = await prismaClient.user.count();
  if (!usersCount) {
    for (const user of USERS) {
      await userRepository.create({ data: user });
    }
  }

  // Ensure the configured dev user exists when DEV_DATA_USER_ID is provided.
  let resolvedConfiguredUserId: string | undefined;

  if (DEFAULT_DATA_USER_ID) {
    let configuredUser = await prismaClient.user.findUnique({
      where: { id: DEFAULT_DATA_USER_ID },
      select: { id: true },
    });

    if (!configuredUser) {
      const configuredUserSeed = USERS.find((user) => user.id === DEFAULT_DATA_USER_ID);
      if (configuredUserSeed) {
        await prismaClient.user.create({ data: configuredUserSeed });
        configuredUser = { id: configuredUserSeed.id };
      }
    }

    resolvedConfiguredUserId = configuredUser?.id;
  }

  const fallbackUser = await prismaClient.user.findFirst({ select: { id: true } });
  const userId = resolvedConfiguredUserId || fallbackUser?.id;

  if (!userId) return;

  const sessionsCount = await prismaClient.session.count();
  if (!sessionsCount) {
    const sessionsData = [...SESSIONS_BUY, ...SESSIONS_SELL].map((session) => ({
      ...session,
      user_id: userId,
    }));
    await prismaClient.session.createMany({
      data: sessionsData,
      skipDuplicates: true,
    });
  }

  const lotsCount = await prismaClient.lot.count();
  if (!lotsCount) {
    await prismaClient.lot.createMany({
      data: LOTS.map((lot) => ({ ...lot, user_id: userId })),
      skipDuplicates: true,
    });
  }

  const sessionLinesCount = await prismaClient.sessionLine.count();
  if (!sessionLinesCount) {
    const sessionLinesData = [...SESSION_BUY_LINES, ...SESSION_SELL_LINES].map((line) => ({
      ...line,
      user_id: userId,
    }));
    await prismaClient.sessionLine.createMany({
      data: sessionLinesData,
      skipDuplicates: true,
    });
  }

  await prismaClient.session.updateMany({
    where: {},
    data: { user_id: userId },
  });

  await prismaClient.lot.updateMany({
    where: { user_id: null },
    data: { user_id: userId },
  });
};

export { seedDevData };
