import { type FastifyInstance, type FastifySchema } from 'fastify';
import S from 'fluent-json-schema';

const body = S.object()
  .prop('username', S.string().required())
  .prop('password', S.string().required())
  .valueOf();

const schema: FastifySchema = {
  response: {
    200: {
      type: 'string',
    },
  },
  body,
  // body: {
  //   type: 'object',
  //   required: [],
  //   properties: {
  //     hey: { type: 'boolean' },
  //     hoe: { type: 'string' },
  //   },
  // },
};

export async function ping(fastify: FastifyInstance): Promise<void> {
  fastify.post('/ping', { schema }, async (req, res) => {
    console.log(body);
    res.status(200).send(JSON.stringify(req.user));
  });
}
