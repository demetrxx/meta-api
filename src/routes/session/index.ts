import { type FastifyInstance } from 'fastify';

import { HistorySessionService } from '@/modules/history';
import { loadRoutes } from '@/shared/system';

import { complete } from './complete/complete';
import { deleteById } from './deleteById/deleteById';
import { find } from './find/find';
import { getActive } from './getActive/getActive';
import { recordAnswer } from './recordAnswer/recordAnswer';
import { start } from './start/start';

export const sessionRoutes = loadRoutes({
  routes: [start, getActive, complete, deleteById, recordAnswer, find],
  opts: { prefix: '/session' },
  decorators: { historySession: (fastify: FastifyInstance) => new HistorySessionService(fastify) },
});
