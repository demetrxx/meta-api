import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryQuestionInput } from '@/modules/history/typebox/question';
import { toIdsObjArr } from '@/shared/lib';

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

export async function paymentOptionUpdate(fastify: FastifyInstance): Promise<void> {
  fastify.patch<T>('/questions/:id', { schema }, async (req, res) => {
    const updateData = {
      ...req.body,
      topics: req.body.topics ? { connect: toIdsObjArr(req.body.topics) } : undefined,
      keyWords: { set: req.body.keyWords },
    };

    return await fastify.historyContent.updateQuestion(Number(req.params.id), updateData);
  });
}
