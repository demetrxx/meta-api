import { type FastifyInstance } from 'fastify';
import S from 'fluent-json-schema';

const body = S.object()
  .prop('username', S.string().required())
  .prop('password', S.string().required())
  .valueOf();

// interface IQuerystring {
//   username: string;
//   password: string;
// }
//
// interface IHeaders {
//   'h-Custom': string;
// }

// interface IReply {
//   200: { success: boolean };
//   302: { url: string };
//   '4xx': { error: string };
// }

export async function auth(fastify: FastifyInstance): Promise<void> {
  fastify.post<{
    // Querystring: IQuerystring;
    // Headers: IHeaders;
    // Reply: IReply,
  }>(
    '/auth',
    {
      schema: { body },
      // preValidation: (req, res, done) => {
      //   const { username } = req.query;
      //   done(username !== 'admin' ? new Error('Must be admin') : undefined);
      // },
    },
    async (req, res) => {
      // const customerHeader = req.headers['h-Custom'];
      const token = fastify.jwt.sign(req.body as { login: string });

      // res.code(200).send({ success: true });
      // res.code(404).send({error: 'Not found'});

      return { token };
    },
  );
}
