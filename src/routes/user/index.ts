import { type FastifyInstance } from 'fastify';

import { HistoryProfileService } from '@/modules/history';
import { getProfile } from '@/routes/user/getProfile/getProfile';
import { getProgress } from '@/routes/user/getProgress/getProgress';
import { loadRoutes } from '@/shared/system';

export const userRoutes = loadRoutes({
  routes: [getProfile, getProgress],
  opts: { prefix: '/user' },
  decorators: { historyProfile: (fastify: FastifyInstance) => new HistoryProfileService(fastify) },
});
