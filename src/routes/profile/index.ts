import { type FastifyInstance } from 'fastify';

import { HistoryProfileService } from '@/modules/history';
import { getProfile } from '@/routes/profile/getProfile/getProfile';
import { getProgress } from '@/routes/profile/getProgress/getProgress';
import { loadRoutes } from '@/shared/system';

export const profileRoutes = loadRoutes({
  routes: [getProfile, getProgress],
  opts: { prefix: '/profile' },
  decorators: { historyProfile: (fastify: FastifyInstance) => new HistoryProfileService(fastify) },
});
