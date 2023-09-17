"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const config_1 = require("./config");
const env = (process.env.NODE_ENV ?? 'development');
(async () => {
    const config = config_1.configMap[env];
    const fastify = (0, main_1.buildServer)(config);
    try {
        await fastify.listen({ port: Number(process.env.PORT) });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();
