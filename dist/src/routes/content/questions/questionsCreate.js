"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsCreate = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("../../../modules/history/typebox/question");
const lib_1 = require("../../../shared/lib");
const body = question_1.TBHistoryQuestionInput;
const response = { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) };
const schema = { body, response };
async function questionsCreate(fastify) {
    fastify.post('/questions', { schema }, async (req, res) => {
        const createData = {
            ...req.body,
            topics: { connect: (0, lib_1.toIdsObjArr)(req.body.topics) },
            keyWords: { connect: req.body.keyWords },
        };
        const result = await fastify.historyContent.createQuestion(createData);
        res.status(201);
        return result;
    });
}
exports.questionsCreate = questionsCreate;
