import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import { type FastifyInstance } from 'fastify';
import { objectToSearchParams } from 'shared/lib';
import sget from 'simple-get';

import { errMsg } from '@/shared/consts/errMsg';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

export interface GoogleUser {
  id?: string;
  email: string;
  verified_email?: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}

export interface RedirectState {
  success: boolean;
  refreshToken?: string;
  accessToken?: string;
  errMsg?: ValueOf<typeof errMsg>;
  type?: 'login' | 'register';
}

const GOOGLE_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export async function google(fastify: FastifyInstance): Promise<void> {
  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: fastify.env.GOOGLE_ID,
        secret: fastify.env.GOOGLE_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/google',
    callbackUri: `${fastify.env.API_URL}/auth/google/callback`,
    scope: ['profile', 'email'],
  });

  fastify.get('/google/callback', async function (request, reply) {
    function redirect(state: RedirectState): void {
      const params = objectToSearchParams(state);

      reply.redirect(
        `${fastify.env.CLIENT_URL}${fastify.env.GOOGLE_CLIENT_REDIRECT_PATH}${params}`,
      );
    }

    try {
      const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      const handleGoogleUserData = async (err: Error | null, data: GoogleUser): Promise<void> => {
        if (err) {
          redirect({ success: false, errMsg: errMsg.googleFailure });
          return;
        }

        const user = await this.prisma.user.findUnique({ where: { email: data.email } });

        if (user) {
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
            oauthProvider: 'google',
            email: data.email,
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
          url: GOOGLE_INFO_URL,
          method: 'GET',
          headers: { Authorization: 'Bearer ' + token.access_token },
          json: true,
        },
        (err, _, data) => {
          handleGoogleUserData(err, data as GoogleUser);
        },
      );
    } catch (err: any) {
      redirect({ success: false, errMsg: err.message });
    }

    await reply;
  });
}
