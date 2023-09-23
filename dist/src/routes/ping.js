"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const schema = {
    response: {
        200: {
            type: 'string',
        },
    },
};
async function ping(fastify) {
    fastify.post('/ping', { schema }, async (req, res) => {
        console.log(req.body);
        return JSON.stringify(req.user);
    });
}
exports.ping = ping;
