import { type Static, Type } from '@sinclair/typebox';
import EnvSchema from 'env-schema';

const schema = Type.Object({
  PORT: Type.Number(),
  NODE_ENV: Type.Union([Type.Literal('production'), Type.Literal('development')]),
  JWT_SECRET_ACCESS: Type.String(),
  JWT_SECRET_REFRESH: Type.String(),
  CLIENT_URL: Type.String(),
  API_URL: Type.String(),
  GOOGLE_SECRET: Type.String(),
  GOOGLE_ID: Type.String(),
  GOOGLE_CLIENT_REDIRECT_PATH: Type.String(),
});

export type IEnvSchema = Static<typeof schema>;

declare module 'fastify' {
  interface FastifyInstance {
    env: IEnvSchema;
  }
}
export const envSchema = EnvSchema<IEnvSchema>({
  schema,
  dotenv: true,
});
