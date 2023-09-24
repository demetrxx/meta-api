import Fastify, { type FastifyInstance } from 'fastify';
import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { routes } from './routes';
import { prismaPlugin, jwtPlugin, validatorPlugin } from './plugins';
import { type Config, type IEnvSchema } from '../config';
import errors from 'http-errors';
import sget from 'simple-get';
import { objectToSearchParams } from '@/lib';

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

const oAuthProvider = {
  GOOGLE: 'google',
} as const;

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
    startRedirectPath: '/oauth/google',
    callbackUri: 'http://localhost:8000/oauth/google/callback',
    scope: ['profile', 'email'],
  });

  app.get('/oauth/google/callback', async function (request, reply) {
    try {
      const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      const stateErrMsg = {
        emailNotConfirmed: 'Email is not confirmed.',
        googleFailure: 'Failed to get user data from Google.',
      } as const;

      interface RedirectState {
        success: boolean;
        refreshToken?: string;
        accessToken?: string;
        errMsg?: (typeof stateErrMsg)[keyof typeof stateErrMsg];
        type?: 'login' | 'register';
      }

      function redirect(state: RedirectState): void {
        const params = objectToSearchParams(state);

        reply.redirect(`http://localhost:3000${params}`);
      }

      const handleGoogleUserData = async (err: Error | null, data: GoogleUser): Promise<void> => {
        if (err) {
          redirect({ success: false, errMsg: stateErrMsg.googleFailure });
          return;
        }

        const user = await this.prisma.user.findUnique({ where: { email: data.email } });

        if (user) {
          if (!user.isEmailVerified) {
            redirect({ success: false, errMsg: stateErrMsg.emailNotConfirmed });
            return;
          }

          // Login
          const tokenData = { id: user.id, roles: user.roles };

          const accessToken = this.generateAccessToken(tokenData);
          const refreshToken = this.generateRefreshToken(tokenData);

          redirect({ success: true, accessToken, type: 'login', refreshToken });
          return;
        }

        // Register
        const newUser = await this.prisma.user.create({
          data: {
            googleId: data.id,
            oauthProvider: oAuthProvider.GOOGLE,
            email: data.email,
            isEmailVerified: true,
            profile: {
              create: {
                firstName: data.given_name,
                lastName: data.family_name,
                avatar: data.picture,
              },
            },
          },
        });

        const tokenData = { id: newUser.id, roles: newUser.roles };

        const accessToken = this.generateAccessToken(tokenData);
        const refreshToken = this.generateRefreshToken(tokenData);

        redirect({ success: true, type: 'register', accessToken, refreshToken });
      };

      sget.concat(
        {
          url: 'https://www.googleapis.com/oauth2/v2/userinfo',
          method: 'GET',
          headers: { Authorization: 'Bearer ' + token.access_token },
          json: true,
        },
        (err, res, data) => {
          handleGoogleUserData(err, data as GoogleUser);
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
