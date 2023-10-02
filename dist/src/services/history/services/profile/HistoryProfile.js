"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryProfile = void 0;
class HistoryProfile {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
}
exports.HistoryProfile = HistoryProfile;
