import configDev from './config.development';
import configProd from './config.production';

export type Config = typeof configDev | typeof configProd;

export const configMap: Record<Env, Config> = {
  development: configDev,
  production: configProd,
};
