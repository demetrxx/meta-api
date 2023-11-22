"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectId = exports.toIdsObjArr = exports.getIdsArr = void 0;
function getIdsArr(items) {
    return items?.map((i) => i.id) ?? [];
}
exports.getIdsArr = getIdsArr;
function toIdsObjArr(items) {
    return items.map((id) => ({ id }));
}
exports.toIdsObjArr = toIdsObjArr;
exports.selectId = { select: { id: true } };
