import { type FastifyInstance } from 'fastify';

import { HistoryContent } from '@/modules/history';
import { ticketsGetById } from '@/routes/content/tickets/ticketsGetById';
import { loadRoutes } from '@/shared/system';

import { keyWordsCreate } from './keyWords/keyWordsCreate';
import { keyWordsDelete } from './keyWords/keyWordsDelete';
import { keyWordsGetByTopic } from './keyWords/keyWordsGetByTopic';
import { keyWordsUpdate } from './keyWords/keyWordsUpdate';
import { questionsCreate } from './questions/questionsCreate';
import { questionsDelete } from './questions/questionsDelete';
import { questionsGetById } from './questions/questionsGetById';
import { questionsGetMany } from './questions/questionsGetMany';
import { questionsUpdate } from './questions/questionsUpdate';
import { ticketsCreate } from './tickets/ticketsCreate';
import { ticketsDelete } from './tickets/ticketsDelete';
import { ticketsGetAll } from './tickets/ticketsGetAll';
import { ticketsUpdate } from './tickets/ticketsUpdate';
import { topicsCreate } from './topics/topicsCreate';
import { topicsDelete } from './topics/topicsDelete';
import { topicsGetAll } from './topics/topicsGetAll';
import { topicsUpdate } from './topics/topicsUpdate';

export const contentRoutes = loadRoutes({
  routes: [
    // keyWords
    keyWordsGetByTopic,
    keyWordsUpdate,
    keyWordsCreate,
    keyWordsDelete,
    // questions
    questionsCreate,
    questionsDelete,
    questionsGetMany,
    questionsGetById,
    questionsUpdate,
    // topics
    topicsGetAll,
    topicsUpdate,
    topicsCreate,
    topicsDelete,
    // tickets
    ticketsCreate,
    ticketsGetAll,
    ticketsGetById,
    ticketsUpdate,
    ticketsDelete,
  ],
  opts: { prefix: '/content' },
  decorators: { historyContent: (fastify: FastifyInstance) => new HistoryContent(fastify) },
  adminsOnly: true,
});
