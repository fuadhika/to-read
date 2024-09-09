"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = error;
function error(error, req, res, next) {
    const defaultError = {
        statusCode: error.statusCode || 500,
        message: error.message || "General server error. Good luck!",
    };
    console.error(error);
    return res
        .status(defaultError.statusCode)
        .json({ error: defaultError.message });
}
