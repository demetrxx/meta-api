"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.routes = exports.ping = void 0;
var ping_1 = require("./ping");
Object.defineProperty(exports, "ping", { enumerable: true, get: function () { return ping_1.ping; } });
var firstRoute_1 = require("./firstRoute");
Object.defineProperty(exports, "routes", { enumerable: true, get: function () { return firstRoute_1.routes; } });
var auth_1 = require("./auth");
Object.defineProperty(exports, "auth", { enumerable: true, get: function () { return auth_1.auth; } });
