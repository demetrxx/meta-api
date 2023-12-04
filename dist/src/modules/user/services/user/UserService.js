"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errMsg_1 = require("../../../../shared/consts/errMsg");
const lib_1 = require("../../../../shared/lib");
class UserService {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async getMany({ page, limit }) {
        return await this.db.user.findMany((0, lib_1.getPagination)({ page, limit }));
    }
    async getByEmail(email) {
        const user = await this.db.user.findUnique({ where: { email } });
        if (!user)
            throw new Error(errMsg_1.errMsg.invalidEmail);
        return user;
    }
    async changeRoles(id, roles) {
        await this.db.user.update({
            where: { id },
            data: { roles: { set: roles } },
        });
    }
    async changeStatus(id, accountStatus) {
        await this.db.user.update({
            where: { id },
            data: { accountStatus },
        });
    }
    async deleteById(id) {
        await this.db.user.delete({ where: { id } });
    }
}
exports.UserService = UserService;
