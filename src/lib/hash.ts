import * as crypto from 'node:crypto';
import ArrayBufferView = NodeJS.ArrayBufferView;

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SCRYPT_PREFIX = '$scrypt$N=16384,r=8,p=1,maxmem=67108864$';

const serializeHash = (hash: Buffer, salt: Buffer): string => {
  const saltString = salt.toString('base64').split('=')[0];
  const hashString = hash.toString('base64').split('=')[0];
  return `${SCRYPT_PREFIX}${saltString}$${hashString}`;
};

const parseOptions = (options: string): Record<string, string> => {
  const values = [];
  const items = options.split(',');
  for (const item of items) {
    const [key, val] = item.split('=');
    values.push([key, Number(val)]);
  }
  return Object.fromEntries(values);
};

const deserializeHash = (
  phcString: string,
): { salt: Buffer; params: Record<string, string>; hash: Buffer } => {
  const [, name, options, salt64, hash64] = phcString.split('$');
  if (name !== 'scrypt') {
    throw new Error('Node.js crypto module only supports scrypt');
  }
  const params = parseOptions(options);
  const salt = Buffer.from(salt64, 'base64');
  const hash = Buffer.from(hash64, 'base64');
  return { params, salt, hash };
};

const SALT_LEN = 32;
const KEY_LEN = 64;

export const hashPassword = async (password: string): Promise<string> =>
  await new Promise((resolve, reject) => {
    crypto.randomBytes(SALT_LEN, (err, salt) => {
      if (err) {
        reject(err);
        return;
      }
      crypto.scrypt(password, salt, KEY_LEN, SCRYPT_PARAMS, (err, hash) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(serializeHash(hash, salt));
      });
    });
  });

export const validatePassword = async (password: string, serHash: string): Promise<boolean> => {
  const { params, salt, hash } = deserializeHash(serHash);
  return await new Promise((resolve, reject) => {
    const callback = (err: Error | null, hashedPassword: ArrayBufferView): void => {
      if (err) {
        reject(err);
        return;
      }

      console.log(hashedPassword, hash);
      resolve(crypto.timingSafeEqual(hashedPassword, hash));
    };
    crypto.scrypt(password, salt, hash.length, params, callback);
  });
};
