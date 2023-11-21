"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const history_1 = require("@/modules/history");
const getProfile_1 = require("@/routes/user/getProfile/getProfile");
const getProgress_1 = require("@/routes/user/getProgress/getProgress");
const system_1 = require("@/shared/system");
exports.userRoutes = (0, system_1.loadRoutes)([getProfile_1.getProfile, getProgress_1.getProgress], { prefix: '/user' }, { historyProfile: (fastify) => new history_1.HistoryProfileService(fastify) });
