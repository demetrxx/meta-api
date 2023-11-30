"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentRoutes = void 0;
const history_1 = require("../../modules/history");
const ticketsGetById_1 = require("../../routes/content/tickets/ticketsGetById");
const system_1 = require("../../shared/system");
const keyWordsCreate_1 = require("./keyWords/keyWordsCreate");
const keyWordsDelete_1 = require("./keyWords/keyWordsDelete");
const keyWordsGetByTopic_1 = require("./keyWords/keyWordsGetByTopic");
const keyWordsUpdate_1 = require("./keyWords/keyWordsUpdate");
const questionsCreate_1 = require("./questions/questionsCreate");
const questionsDelete_1 = require("./questions/questionsDelete");
const questionsGetById_1 = require("./questions/questionsGetById");
const questionsGetMany_1 = require("./questions/questionsGetMany");
const questionsUpdate_1 = require("./questions/questionsUpdate");
const ticketsCreate_1 = require("./tickets/ticketsCreate");
const ticketsDelete_1 = require("./tickets/ticketsDelete");
const ticketsGetAll_1 = require("./tickets/ticketsGetAll");
const ticketsUpdate_1 = require("./tickets/ticketsUpdate");
const topicsCreate_1 = require("./topics/topicsCreate");
const topicsDelete_1 = require("./topics/topicsDelete");
const topicsGetAll_1 = require("./topics/topicsGetAll");
const topicsUpdate_1 = require("./topics/topicsUpdate");
exports.contentRoutes = (0, system_1.loadRoutes)({
    routes: [
        // keyWords
        keyWordsGetByTopic_1.keyWordsGetByTopic,
        keyWordsUpdate_1.keyWordsUpdate,
        keyWordsCreate_1.keyWordsCreate,
        keyWordsDelete_1.keyWordsDelete,
        // questions
        questionsCreate_1.questionsCreate,
        questionsDelete_1.questionsDelete,
        questionsGetMany_1.questionsGetMany,
        questionsGetById_1.questionsGetById,
        questionsUpdate_1.questionsUpdate,
        // topics
        topicsGetAll_1.topicsGetAll,
        topicsUpdate_1.topicsUpdate,
        topicsCreate_1.topicsCreate,
        topicsDelete_1.topicsDelete,
        // tickets
        ticketsCreate_1.ticketsCreate,
        ticketsGetAll_1.ticketsGetAll,
        ticketsGetById_1.ticketsGetById,
        ticketsUpdate_1.ticketsUpdate,
        ticketsDelete_1.ticketsDelete,
    ],
    opts: { prefix: '/content' },
    decorators: { historyContent: (fastify) => new history_1.HistoryContent(fastify) },
    adminsOnly: true,
});
