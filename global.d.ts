declare type ValueOf<T> = T[keyof T];

declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type OptionalRecord<R extends keyof any, T> = {
  [P in R]?: T;
};

type EnvMode = 'production' | 'development';

interface Pagination {
  page?: number;
  limit?: number;
}

type Id = number;

declare module 'cloudipsp-node-js-sdk';
