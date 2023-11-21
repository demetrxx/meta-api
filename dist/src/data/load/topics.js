"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTopics = void 0;
const topics_1 = __importDefault(require("../data/topics"));
async function loadTopics(prisma) {
    const data = topics_1.default.map((topic, idx) => ({
        order: idx + 1,
        name: topic,
    }));
    await prisma.historyTopic.createMany({ data });
}
exports.loadTopics = loadTopics;
