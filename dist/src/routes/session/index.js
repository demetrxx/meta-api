"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRoutes = void 0;
const history_1 = require("../../modules/history");
const system_1 = require("../../shared/system");
const complete_1 = require("./complete/complete");
const deleteById_1 = require("./deleteById/deleteById");
const find_1 = require("./find/find");
const getActive_1 = require("./getActive/getActive");
const recordAnswer_1 = require("./recordAnswer/recordAnswer");
const start_1 = require("./start/start");
exports.sessionRoutes = (0, system_1.loadRoutes)({
    routes: [start_1.start, getActive_1.getActive, complete_1.complete, deleteById_1.deleteById, recordAnswer_1.recordAnswer, find_1.find],
    opts: { prefix: '/session' },
    decorators: { historySession: (fastify) => new history_1.HistorySessionService(fastify) },
});
