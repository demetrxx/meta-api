export const config = {
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname,req,res',
      },
    },
  },
} as const;

export default config;

export type ConfigDev = typeof config;
