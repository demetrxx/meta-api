import { type FastifyInstance } from 'fastify';

import { HistoryTopicPractice } from '@/modules/history';
import { loadRoutes } from '@/shared/system';

import { getQuestions } from './getQuestions/getQuestions';
import { recordAnswer } from './recordAnswer/recordAnswer';

export const practiceRoutes = loadRoutes({
  routes: [getQuestions, recordAnswer],
  opts: { prefix: '/practice' },
  decorators: {
    historyTopicPractice: (fastify: FastifyInstance) => new HistoryTopicPractice(fastify),
  },
});
