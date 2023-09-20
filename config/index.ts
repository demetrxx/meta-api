import configDev from './config.development';
import configProd from './config.production';
export { envSchema, type IEnvSchema } from './envSchema';

export type Config = typeof configDev | typeof configProd;

export const configMap: Record<EnvMode, Config> = {
  development: configDev,
  production: configProd,
};
