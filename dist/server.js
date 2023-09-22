"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./src/main");
const config_1 = require("./config");
(async () => {
    const config = config_1.configMap[config_1.envSchema.NODE_ENV];
    const fastify = (0, main_1.buildServer)(config, config_1.envSchema);
    try {
        await fastify.listen({ port: config_1.envSchema.PORT });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();
