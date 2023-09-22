"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
async function routes(fastify) {
    fastify.get('/', async (req, res) => {
        await fastify.prisma.user.create({ data: { email: 'demetrxx@gmail.com', password: '1234' } });
        return await fastify.prisma.user.findMany();
    });
}
exports.routes = routes;
