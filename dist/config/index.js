"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configMap = exports.envSchema = void 0;
const config_development_1 = __importDefault(require("./config.development"));
const config_production_1 = __importDefault(require("./config.production"));
var envSchema_1 = require("./envSchema");
Object.defineProperty(exports, "envSchema", { enumerable: true, get: function () { return envSchema_1.envSchema; } });
exports.configMap = {
    development: config_development_1.default,
    production: config_production_1.default,
};
