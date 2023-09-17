const config = {
  logger: true,
} as const;

export type ConfigProd = typeof config;

export default config;
