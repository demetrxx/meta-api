"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMany = void 0;
const typebox_1 = require("@sinclair/typebox");
const querystring = typebox_1.Type.Object({
    page: typebox_1.Type.String(),
    limit: typebox_1.Type.String(),
});
const schema = {
    querystring,
};
async function getMany(fastify) {
    fastify.get('/', { schema }, async (req, res) => {
        const { page, limit } = req.query;
        return await fastify.userService.getMany({ page: Number(page), limit: Number(limit) });
    });
}
exports.getMany = getMany;
