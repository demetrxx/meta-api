import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { HistoryTopicPractice } from '@/services/history/services/topicPractice/HistoryTopicPractice';

const params = Type.Object({
  topicId: Type.String(),
});

// const schema: FastifySchema = {
//   params: {
//     topicId: {
//       type: 'string'
//     }
//   },
//   response: {
//     200: {
//       type: 'string',
//     },
//   },
// };

const schema: FastifySchema = { params };

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}

export async function practice(fastify: FastifyInstance): Promise<void> {
  fastify.decorate('historyTopicPracticeService', new HistoryTopicPractice(fastify));

  fastify.get<T>('/practice/:topicId', { schema }, async (req, res) => {
    const questions = await fastify.historyTopicPractice.getQuestions({
      userId: fastify.user.id,
      topicId: Number(req.params.topicId),
    });
    return JSON.stringify(questions);
  });
  fastify.post('/practice', { schema }, async (req, res) => {
    console.log(req.body);
    return JSON.stringify(req.user);
  });
}
