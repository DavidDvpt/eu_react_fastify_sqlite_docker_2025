import { UserRepository } from '../src/lib/repositories/index.js';
import prismaClient from './prismaClient.js';
import { LOTS } from './seedDatas/lots.js';
import { SESSIONS_BUY, SESSION_BUY_LINES } from './seedDatas/session_buy.js';
import { SESSIONS_SELL, SESSION_SELL_LINES } from './seedDatas/session_sell.js';
import { USERS } from './seedDatas/user.js';

const userRepository = new UserRepository(prismaClient);
const DEFAULT_DATA_USER_ID = process.env.DEV_DATA_USER_ID;

const normalizeSeededSessionStatuses = async () => {
  await prismaClient.sessionLine.updateMany({
    where: {
      line_status: {
        not: 'CLOSED',
      },
    },
    data: {
      line_status: 'CLOSED',
    },
  });

  await prismaClient.session.updateMany({
    where: {
      status: {
        not: 'CLOSED',
      },
    },
    data: {
      status: 'CLOSED',
    },
  });

  const perSessionLotState = await prismaClient.$queryRaw<
    Array<{ session_id: string; has_nonzero_lot: bigint | number }>
  >`
    WITH lot_flow AS (
      SELECT
        l.id AS lot_id,
        COALESCE(SUM(CASE WHEN sl.line_type = 'IN'  THEN sl.quantity ELSE 0 END), 0) AS qty_in,
        COALESCE(
          SUM(
            CASE
              WHEN sl.line_type = 'OUT' AND sl.sale_status = 'SOLDED' THEN sl.quantity
              ELSE 0
            END
          ),
          0
        ) AS qty_out
      FROM "lot" l
      LEFT JOIN "session_line" sl
        ON sl.inventory_lot_id = l.id
      GROUP BY l.id
    ),
    session_lot_links AS (
      SELECT DISTINCT
        sl.session_id,
        sl.inventory_lot_id AS lot_id
      FROM "session_line" sl
      WHERE sl.inventory_lot_id IS NOT NULL
    )
    SELECT
      sll.session_id,
      MAX(
        CASE
          WHEN (lf.qty_in - lf.qty_out) <> 0 THEN 1
          ELSE 0
        END
      ) AS has_nonzero_lot
    FROM session_lot_links sll
    JOIN lot_flow lf
      ON lf.lot_id = sll.lot_id
    GROUP BY sll.session_id
  `;

  const toArchiveIds = perSessionLotState
    .filter((row) => Number(row.has_nonzero_lot) === 0)
    .map((row) => row.session_id);
  const toCloseIds = perSessionLotState
    .filter((row) => Number(row.has_nonzero_lot) === 1)
    .map((row) => row.session_id);

  if (toArchiveIds.length > 0) {
    await prismaClient.session.updateMany({
      where: {
        id: {
          in: toArchiveIds,
        },
      },
      data: {
        status: 'ARCHIVED',
      },
    });
  }

  if (toCloseIds.length > 0) {
    await prismaClient.session.updateMany({
      where: {
        id: {
          in: toCloseIds,
        },
      },
      data: {
        status: 'CLOSED',
      },
    });
  }

  const negativeLots = await prismaClient.$queryRaw<
    Array<{ lot_id: string; qty_in: bigint | number; qty_out: bigint | number; diff: bigint | number }>
  >`
    WITH lot_flow AS (
      SELECT
        l.id AS lot_id,
        COALESCE(SUM(CASE WHEN sl.line_type = 'IN'  THEN sl.quantity ELSE 0 END), 0) AS qty_in,
        COALESCE(
          SUM(
            CASE
              WHEN sl.line_type = 'OUT' AND sl.sale_status = 'SOLDED' THEN sl.quantity
              ELSE 0
            END
          ),
          0
        ) AS qty_out
      FROM "lot" l
      LEFT JOIN "session_line" sl
        ON sl.inventory_lot_id = l.id
      GROUP BY l.id
    )
    SELECT
      lot_id,
      qty_in,
      qty_out,
      (qty_in - qty_out) AS diff
    FROM lot_flow
    WHERE (qty_in - qty_out) < 0
  `;

  if (negativeLots.length > 0) {
    console.warn(
      `[seedDev] ${negativeLots.length} lots have negative balance (in - out < 0):`,
      negativeLots.map((row) => ({
        lotId: row.lot_id,
        qtyIn: Number(row.qty_in),
        qtyOut: Number(row.qty_out),
        diff: Number(row.diff),
      }))
    );
  }
};

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
      if (configuredUserSeed?.id) {
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

  await normalizeSeededSessionStatuses();
};

export { seedDevData };
