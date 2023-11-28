"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const common_1 = require("@/modules/user");
const system_1 = require("@/shared/system");
const changeRoles_1 = require("./changeRoles/changeRoles");
const changeStatus_1 = require("./changeStatus/changeStatus");
const deleteById_1 = require("./deleteById/deleteById");
const getByEmail_1 = require("./getByEmail/getByEmail");
const getMany_1 = require("./getMany/getMany");
exports.userRoutes = (0, system_1.loadRoutes)({
    routes: [getByEmail_1.getByEmail, getMany_1.getMany, changeStatus_1.changeStatus, changeRoles_1.changeRoles, deleteById_1.deleteById],
    opts: { prefix: '/user' },
    decorators: { userService: (fastify) => new common_1.UserService(fastify) },
    adminsOnly: true,
});
