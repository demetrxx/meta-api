"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeOut = exports.selectId = exports.toIdsObjArr = exports.getIdsArr = void 0;
function getIdsArr(items) {
    return items?.map((i) => i.id) ?? [];
}
exports.getIdsArr = getIdsArr;
function toIdsObjArr(items) {
    return items.map((id) => ({ id }));
}
exports.toIdsObjArr = toIdsObjArr;
exports.selectId = { select: { id: true } };
async function timeOut(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}
exports.timeOut = timeOut;
