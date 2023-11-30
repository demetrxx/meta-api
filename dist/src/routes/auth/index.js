"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const system_1 = require("@/shared/system");
const google_1 = require("./google/google");
const token_1 = require("./token/token");
exports.authRoutes = (0, system_1.loadRoutes)({
    routes: [token_1.token, google_1.google],
    opts: { prefix: '/auth' },
});
