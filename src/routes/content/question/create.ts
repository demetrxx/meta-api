import { type Static } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryQuestionInput } from '@/shared/typebox/question';

const body = TBHistoryQuestionInput;

const schema: FastifySchema = { body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function questions(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/question', { schema }, async (req, res) => {
    await fastify.historyContent.createQuestion({
      ...req.body,
      topic: { connect: { id: req.body.topicId } },
      keyWords: { connect: req.body.keyWords },
    });

    return await res.status(201).send();
  });
}
