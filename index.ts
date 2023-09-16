import Fastify from 'fastify';
import { routes } from './routes/firstRoute';
import prismaPlugin from './plugins/prisma';

const fastify = Fastify({
  logger: true,
});

interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  'h-Custom': string;
}

interface IReply {
  200: { success: boolean };
  302: { url: string };
  '4xx': { error: string };
}

fastify.register(prismaPlugin);
fastify.register(routes);

fastify.get<{
  Querystring: IQuerystring;
  Headers: IHeaders;
  // Reply: IReply,
}>(
  '/auth',
  {
    preValidation: (req, res, done) => {
      const { username, password } = req.query;
      done(username !== 'admin' ? new Error('Must be admin') : undefined);
    },
  },
  async (req, res) => {
    const customerHeader = req.headers['h-Custom'];

    // res.code(200).send({ success: true });
    // res.code(404).send({error: 'Not found'});

    return 'logged in!';
  },
);

fastify.get('/ping', async (req, res) => {
  return 'pong\n';
});

(async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
