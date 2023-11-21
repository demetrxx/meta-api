import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryTicketInput } from '@/modules/history/typebox/ticket';
import { toIdsObjArr } from '@/shared/lib';

const body = TBHistoryTicketInput;

const response = { '2xx': Type.Object({ id: Type.Number() }) };

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function ticketsCreate(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/tickets', { schema }, async (req, res) => {
    const questions = await Promise.all(
      req.body.questions.map(async (q) => {
        const res = await fastify.historyContent.createQuestion({
          ...q,
          topics: { connect: toIdsObjArr(q.topics) },
          keyWords: { connect: q.keyWords },
        });

        if (q.order === 49 || q.order === 50) {
          console.log(res.id);
        }

        return res;
      }),
    );

    const result = await fastify.historyContent.createTicket({
      ...req.body,
      questions: { connect: questions },
    });

    res.status(201);

    return result;
  });
}
