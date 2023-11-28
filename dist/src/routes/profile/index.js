"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = void 0;
const history_1 = require("@/modules/history");
const getProfile_1 = require("@/routes/profile/getProfile/getProfile");
const getProgress_1 = require("@/routes/profile/getProgress/getProgress");
const system_1 = require("@/shared/system");
exports.profileRoutes = (0, system_1.loadRoutes)({
    routes: [getProfile_1.getProfile, getProgress_1.getProgress],
    opts: { prefix: '/profile' },
    decorators: { historyProfile: (fastify) => new history_1.HistoryProfileService(fastify) },
});
