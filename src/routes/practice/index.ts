import { type FastifyInstance } from 'fastify';

import { HistoryTopicPractice } from '@/modules/history';
import { loadRoutes } from '@/shared/system';

import { getQuestions } from './getQuestions/getQuestions';
import { recordAnswer } from './recordAnswer/recordAnswer';

export const practiceRoutes = loadRoutes(
  [getQuestions, recordAnswer],
  { prefix: '/practice' },
  { historyTopicPractice: (fastify: FastifyInstance) => new HistoryTopicPractice(fastify) },
);
