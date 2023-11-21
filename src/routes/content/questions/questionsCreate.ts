import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryQuestionInput } from '@/modules/history/typebox/question';
import { toIdsObjArr } from '@/shared/lib';

const body = TBHistoryQuestionInput;

const response = { '2xx': Type.Object({ id: Type.Number() }) };

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function questionsCreate(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/questions', { schema }, async (req, res) => {
    const createData = {
      ...req.body,
      topics: { connect: toIdsObjArr(req.body.topics) },
      keyWords: { connect: req.body.keyWords },
    };

    const result = await fastify.historyContent.createQuestion(createData);

    res.status(201);

    return result;
  });
}
