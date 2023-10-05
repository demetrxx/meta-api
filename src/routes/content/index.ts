import { type FastifyInstance } from 'fastify';

import { HistoryContent } from '@/modules/history';
import { loadRoutes } from '@/shared/system';

import { keyWordsCreate } from './keyWords/keyWordsCreate';
import { keyWordsDelete } from './keyWords/keyWordsDelete';
import { keyWordsGetByTopic } from './keyWords/keyWordsGetByTopic';
import { keyWordsUpdate } from './keyWords/keyWordsUpdate';
import { questionsCreate } from './questions/questionsCreate';
import { questionsDelete } from './questions/questionsDelete';
import { questionsGetById } from './questions/questionsGetById';
import { questionsGetByTopic } from './questions/questionsGetByTopic';
import { questionsUpdate } from './questions/questionsUpdate';
import { ticketsCreate } from './tickets/ticketsCreate';
import { ticketsDelete } from './tickets/ticketsDelete';
import { ticketsGetAll } from './tickets/ticketsGetAll';
import { ticketsUpdate } from './tickets/ticketsUpdate';
import { topicsCreate } from './topics/topicsCreate';
import { topicsDelete } from './topics/topicsDelete';
import { topicsGetAll } from './topics/topicsGetAll';
import { topicsUpdate } from './topics/topicsUpdate';

export const contentRoutes = loadRoutes(
  [
    // keyWords
    keyWordsGetByTopic,
    keyWordsUpdate,
    keyWordsCreate,
    keyWordsDelete,
    // questions
    questionsCreate,
    questionsDelete,
    questionsGetByTopic,
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
    ticketsUpdate,
    ticketsDelete,
  ],
  { prefix: '/content' },
  { historyContent: (fastify: FastifyInstance) => new HistoryContent(fastify) },
);
