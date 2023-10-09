"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcTimePassed = void 0;
function calcTimePassed({ prevTimePassed, lastViewed, }) {
    const now = Date.now();
    return prevTimePassed + (now - lastViewed.getTime());
}
exports.calcTimePassed = calcTimePassed;
