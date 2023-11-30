"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = void 0;
const oauth2_1 = __importDefault(require("@fastify/oauth2"));
const simple_get_1 = __importDefault(require("simple-get"));
const errMsg_1 = require("@/shared/consts/errMsg");
const lib_1 = require("@/shared/lib");
const GOOGLE_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
async function google(fastify) {
    fastify.register(oauth2_1.default, {
        name: 'googleOAuth2',
        credentials: {
            client: {
                id: fastify.env.GOOGLE_ID,
                secret: fastify.env.GOOGLE_SECRET,
            },
            auth: oauth2_1.default.GOOGLE_CONFIGURATION,
        },
        startRedirectPath: '/google',
        callbackUri: `${fastify.env.API_URL}/auth/google/callback`,
        scope: ['profile', 'email'],
    });
    fastify.get('/google/callback', async function (request, reply) {
        function redirect(state) {
            const params = (0, lib_1.objectToSearchParams)(state);
            reply.redirect(`${fastify.env.CLIENT_URL}${fastify.env.GOOGLE_CLIENT_REDIRECT_PATH}${params}`);
        }
        try {
            const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            const handleGoogleUserData = async (err, data) => {
                if (err) {
                    redirect({ success: false, errMsg: errMsg_1.errMsg.googleFailure });
                    return;
                }
                const user = await this.prisma.user.findUnique({ where: { email: data.email } });
                if (user) {
                    // Login
                    const tokenData = { id: user.id, roles: user.roles, accountStatus: user.accountStatus };
                    const accessToken = this.generateAccessToken(tokenData);
                    const refreshToken = this.generateRefreshToken(tokenData);
                    redirect({ success: true, accessToken, type: 'login', refreshToken });
                    return;
                }
                // Register
                const newUser = await this.prisma.user.create({
                    data: {
                        googleId: data.id,
                        oauthProvider: 'google',
                        email: data.email,
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
                url: GOOGLE_INFO_URL,
                method: 'GET',
                headers: { Authorization: 'Bearer ' + token.access_token },
                json: true,
            }, (err, _, data) => {
                handleGoogleUserData(err, data);
            });
        }
        catch (err) {
            redirect({ success: false, errMsg: err.message });
        }
        await reply;
    });
}
exports.google = google;
