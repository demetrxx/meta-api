"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const oauth2_1 = __importDefault(require("@fastify/oauth2"));
const routes_1 = require("./routes");
const plugins_1 = require("./plugins");
const http_errors_1 = __importDefault(require("http-errors"));
const simple_get_1 = __importDefault(require("simple-get"));
function buildServer(config, envSchema) {
    const app = (0, fastify_1.default)({
        logger: config.logger,
    }).withTypeProvider();
    app.register(plugins_1.validatorPlugin);
    app.register(plugins_1.prismaPlugin);
    app.register(plugins_1.jwtPlugin, envSchema);
    app.register(oauth2_1.default, {
        name: 'googleOAuth2',
        credentials: {
            client: {
                id: '7856938342-18eugrpnnm1kpo13e9iiuoiv2fph92h0.apps.googleusercontent.com',
                secret: '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',
            },
            auth: oauth2_1.default.GOOGLE_CONFIGURATION,
        },
        // register a fastify url to start the redirect flow
        startRedirectPath: '/oauth/google',
        // facebook redirect here after the user login
        callbackUri: 'http://localhost:8000/oauth/google/callback',
        scope: ['profile', 'email'],
    });
    app.get('/oauth/google/callback', async function (request, reply) {
        try {
            const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            simple_get_1.default.concat({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token.access_token,
                },
                json: true,
            }, (err, res, data) => {
                if (err)
                    return new http_errors_1.default.Unauthorized(err.message);
                // eslint-disable-next-line
                const a = data;
                // TODO: check email exists
                const exists = true;
                if (exists) {
                    // TODO: login
                }
                else {
                    // TODO: register
                }
                // TODO: redirect with access/refresh tokens in params
                reply.redirect('http://localhost:3000');
            });
        }
        catch (err) {
            throw new http_errors_1.default.Unauthorized(err.message);
        }
        await reply;
    });
    app.register(routes_1.routes);
    return app;
}
exports.buildServer = buildServer;
