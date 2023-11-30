"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFondyDate = void 0;
function formatFondyDate(date) {
    return date.toISOString().slice(0, 10);
}
exports.formatFondyDate = formatFondyDate;
