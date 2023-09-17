"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// interface IReply {
//   200: { success: boolean };
//   302: { url: string };
//   '4xx': { error: string };
// }
async function auth(fastify) {
    fastify.get('/auth', {
        preValidation: (req, res, done) => {
            const { username } = req.query;
            done(username !== 'admin' ? new Error('Must be admin') : undefined);
        },
    }, async (req, res) => {
        // const customerHeader = req.headers['h-Custom'];
        // res.code(200).send({ success: true });
        // res.code(404).send({error: 'Not found'});
        return 'logged in!';
    });
}
exports.auth = auth;
