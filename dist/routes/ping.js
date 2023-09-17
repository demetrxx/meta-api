"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const schema = {
    response: {
        200: {
            type: 'string',
        },
    },
    body: {
        type: 'object',
        required: ['hey'],
        properties: {
            hey: { type: 'boolean' },
            hoe: { type: 'string' },
        },
    },
};
async function ping(fastify) {
    fastify.post('/ping', { schema }, async (req, res) => {
        res.status(200).send('');
    });
}
exports.ping = ping;
