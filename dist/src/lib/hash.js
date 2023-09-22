"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.hashPassword = void 0;
const crypto = __importStar(require("node:crypto"));
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SCRYPT_PREFIX = '$scrypt$N=32768,r=8,p=1,maxmem=67108864$';
const serializeHash = (hash, salt) => {
    const saltString = salt.toString('base64').split('=')[0];
    const hashString = hash.toString('base64').split('=')[0];
    return `${SCRYPT_PREFIX}${saltString}$${hashString}`;
};
const parseOptions = (options) => {
    const values = [];
    const items = options.split(',');
    for (const item of items) {
        const [key, val] = item.split('=');
        values.push([key, Number(val)]);
    }
    return Object.fromEntries(values);
};
const deserializeHash = (phcString) => {
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
const hashPassword = async (password) => await new Promise((resolve, reject) => {
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
exports.hashPassword = hashPassword;
const validatePassword = async (password, serHash) => {
    const { params, salt, hash } = deserializeHash(serHash);
    return await new Promise((resolve, reject) => {
        const callback = (err, hashedPassword) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(crypto.timingSafeEqual(hashedPassword, hash));
        };
        crypto.scrypt(password, salt, hash.length, params, callback);
    });
};
exports.validatePassword = validatePassword;
