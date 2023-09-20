import S from 'fluent-json-schema';
import EnvSchema, { type JSONSchemaType } from 'env-schema';

export interface IEnvSchema {
  JWT_SECRET: string;
  PORT: number;
  NODE_ENV: EnvMode;
}

const schema = S.object()
  .prop('PORT', S.number().required())
  .prop('NODE_ENV', S.enum(['production', 'development']).required())
  .prop('JWT_SECRET', S.string().required());

export const envSchema = EnvSchema({
  schema: schema as unknown as JSONSchemaType<IEnvSchema>,
  dotenv: true,
});
