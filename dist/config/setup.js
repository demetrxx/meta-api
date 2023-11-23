"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const fsp = __importStar(require("node:fs/promises"));
const setupFlagPath = './setup-flag.txt';
async function isSetupCompleted() {
    try {
        // Check if the setup flag or file exists
        await fsp.access(setupFlagPath);
        return true;
    }
    catch (error) {
        // The file does not exist, setup is not completed
        return false;
    }
}
async function markSetupAsCompleted() {
    // Create an empty setup flag or file
    await fsp.writeFile(setupFlagPath, '');
}
async function setup(app) {
    try {
        // Check if setup has already been completed
        const setupCompleted = await isSetupCompleted();
        if (setupCompleted) {
            console.log('Setup has already been completed. Skipping.');
            return;
        }
        // Create the initial admin profile
        const adminUser = await app.prisma.user.create({
            data: {
                email: app.env.OWNER_EMAIL,
                roles: ['USER', 'ADMIN', 'OWNER'],
            },
        });
        console.log('Initial admin profile created:', adminUser);
        // Mark setup as completed
        await markSetupAsCompleted();
    }
    catch (error) {
        console.error('Error during setup:', error);
    }
}
exports.setup = setup;
