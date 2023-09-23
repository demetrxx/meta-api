import Fastify, { type FastifyInstance } from 'fastify';
import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { routes } from './routes';
import { prismaPlugin, jwtPlugin, validatorPlugin } from './plugins';
import { type Config, type IEnvSchema } from '../config';
import errors from 'http-errors';
import sget from 'simple-get';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

interface GoogleUser {
  id?: string;
  email: string;
  verified_email?: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}

export function buildServer(config: Config, envSchema: IEnvSchema): FastifyInstance {
  const app = Fastify({
    logger: config.logger,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(validatorPlugin);
  app.register(prismaPlugin);
  app.register(jwtPlugin, envSchema);

  app.register(oauthPlugin, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: '7856938342-18eugrpnnm1kpo13e9iiuoiv2fph92h0.apps.googleusercontent.com',
        secret: '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',
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: '/oauth/google',
    // facebook redirect here after the user login
    callbackUri: 'http://localhost:8000/oauth/google/callback',
    scope: ['profile', 'email'],
  });

  app.get('/oauth/google/callback', async function (request, reply) {
    try {
      const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      sget.concat(
        {
          url: 'https://www.googleapis.com/oauth2/v2/userinfo',
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token.access_token,
          },
          json: true,
        },
        (err, res, data) => {
          if (err) return new errors.Unauthorized(err.message);
          // eslint-disable-next-line
          const a = data as GoogleUser;

          // TODO: check email exists
          const exists = true;
          if (exists) {
            // TODO: login
          } else {
            // TODO: register
          }

          // TODO: redirect with access/refresh tokens in params
          reply.redirect('http://localhost:3000');
        },
      );
    } catch (err: any) {
      throw new errors.Unauthorized(err.message);
    }

    await reply;
  });

  app.register(routes);

  return app;
}
