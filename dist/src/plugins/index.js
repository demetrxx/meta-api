"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorPlugin = exports.rolesAccessPlugin = exports.prismaPlugin = exports.jwtPlugin = void 0;
var jwt_1 = require("./jwt/jwt");
Object.defineProperty(exports, "jwtPlugin", { enumerable: true, get: function () { return jwt_1.jwtPlugin; } });
var prisma_1 = require("./prisma/prisma");
Object.defineProperty(exports, "prismaPlugin", { enumerable: true, get: function () { return prisma_1.prismaPlugin; } });
var rolesAccess_1 = require("./rolesAccess/rolesAccess");
Object.defineProperty(exports, "rolesAccessPlugin", { enumerable: true, get: function () { return rolesAccess_1.rolesAccessPlugin; } });
var validator_1 = require("./validator/validator");
Object.defineProperty(exports, "validatorPlugin", { enumerable: true, get: function () { return validator_1.validatorPlugin; } });
