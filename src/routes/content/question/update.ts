import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryQuestionInput } from '@/shared/typebox/question';

const params = Type.Object({
  id: Type.String(),
});

const body = Type.Partial(TBHistoryQuestionInput);

const schema: FastifySchema = {
  body,
  params,
  response: { '2xx': Type.Object({ id: Type.Number() }) },
};

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}

export async function update(fastify: FastifyInstance): Promise<void> {
  fastify.patch<T>('/question/:id', { schema }, async (req, res) => {
    return await fastify.historyContent.updateQuestion(Number(req.params.id), {
      ...req.body,
      topic: { connect: { id: req.body.topicId } },
      keyWords: { connect: req.body.keyWords },
    });
  });
}
