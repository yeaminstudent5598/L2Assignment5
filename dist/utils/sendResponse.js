"use strict";
// src/utils/sendResponse.ts
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    var _a;
    const responsePayload = {
        success: data.success,
        message: data.message,
        data: (_a = data.data) !== null && _a !== void 0 ? _a : null,
    };
    if (data.meta !== undefined) {
        responsePayload.meta = data.meta;
    }
    res.status(data.statusCode).json(responsePayload);
};
exports.default = sendResponse;
