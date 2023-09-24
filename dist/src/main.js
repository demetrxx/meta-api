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
const lib_1 = require("@/lib");
const oAuthProvider = {
    GOOGLE: 'google',
};
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
        startRedirectPath: '/google/google',
        callbackUri: 'http://localhost:8000/oauth/google/callback',
        scope: ['profile', 'email'],
    });
    app.get('/oauth/google/callback', async function (request, reply) {
        try {
            const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            const stateErrMsg = {
                emailNotConfirmed: 'Email is not confirmed.',
                googleFailure: 'Failed to get user data from Google.',
            };
            function redirect(state) {
                const params = (0, lib_1.objectToSearchParams)(state);
                reply.redirect(`http://localhost:3000${params}`);
            }
            const handleGoogleUserData = async (err, data) => {
                if (err) {
                    redirect({ success: false, errMsg: stateErrMsg.googleFailure });
                    return;
                }
                const user = await this.prisma.user.findUnique({ where: { email: data.email } });
                if (user) {
                    if (!user.isEmailVerified) {
                        redirect({ success: false, errMsg: stateErrMsg.emailNotConfirmed });
                        return;
                    }
                    // Login
                    const tokenData = { id: user.id, roles: user.roles };
                    const accessToken = this.generateAccessToken(tokenData);
                    const refreshToken = this.generateRefreshToken(tokenData);
                    redirect({ success: true, accessToken, type: 'login', refreshToken });
                    return;
                }
                // Register
                const newUser = await this.prisma.user.create({
                    data: {
                        googleId: data.id,
                        oauthProvider: oAuthProvider.GOOGLE,
                        email: data.email,
                        isEmailVerified: true,
                        profile: {
                            create: {
                                firstName: data.given_name,
                                lastName: data.family_name,
                                avatar: data.picture,
                            },
                        },
                    },
                });
                const tokenData = { id: newUser.id, roles: newUser.roles };
                const accessToken = this.generateAccessToken(tokenData);
                const refreshToken = this.generateRefreshToken(tokenData);
                redirect({ success: true, type: 'register', accessToken, refreshToken });
            };
            simple_get_1.default.concat({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                method: 'GET',
                headers: { Authorization: 'Bearer ' + token.access_token },
                json: true,
            }, (err, res, data) => {
                handleGoogleUserData(err, data);
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
