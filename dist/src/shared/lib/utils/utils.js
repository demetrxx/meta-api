"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdsArr = void 0;
function getIdsArr(items) {
    return items?.map((i) => i.id) ?? [];
}
exports.getIdsArr = getIdsArr;
