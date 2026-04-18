import { StocksService, TradeService } from '../modules/index.js';

import { purchaseTradeBodySchema, sellTradeBodySchema } from './tradeRoutes.schema.js';

import type { FastifyPluginCallback, FastifyRequest } from 'fastify';

function getRequestUserId(request: FastifyRequest): string {
  const user = request.user as { id?: string } | undefined;
  if (!user?.id) {
    throw new Error('Unauthorized');
  }
  return user.id;
}

const tradeRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const stocksService = new StocksService(app.repos.lotStock);
  const tradeService = new TradeService(app.prisma, stocksService);
  app.protect();

  app.post('/trade/purchase', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = purchaseTradeBodySchema.parse(request.body);
    const result = await tradeService.purchase(userId, body.lines);

    if (!result.processed.length) {
      return reply.code(400).send({
        message: 'No purchase line could be processed',
        ...result,
      });
    }

    return reply.code(result.rejected.length ? 207 : 201).send(result);
  });

  app.post('/trade/sell', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = sellTradeBodySchema.parse(request.body);
    const result = await tradeService.sell(userId, body.lines);

    if (!result.processed.length) {
      return reply.code(400).send({
        message: 'No sell line could be processed',
        ...result,
      });
    }

    return reply.code(result.rejected.length ? 207 : 201).send(result);
  });

  done();
};

export default tradeRoutes;
