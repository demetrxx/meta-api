"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToSearchParams = void 0;
function objectToSearchParams(obj) {
    const params = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(obj[key].toString());
            params.push(`${encodedKey}=${encodedValue}`);
        }
    }
    return '?' + params.join('&');
}
exports.objectToSearchParams = objectToSearchParams;
