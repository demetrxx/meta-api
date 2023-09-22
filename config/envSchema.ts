import EnvSchema, { type JSONSchemaType } from 'env-schema';
import { type Static, Type } from '@sinclair/typebox';

const schema = Type.Object({
  PORT: Type.Number(),
  NODE_ENV: Type.Union([Type.Literal('production'), Type.Literal('development')]),
  JWT_SECRET: Type.String(),
});

export type IEnvSchema = Static<typeof schema>;

export const envSchema = EnvSchema({
  schema: schema as unknown as JSONSchemaType<IEnvSchema>,
  dotenv: true,
});
