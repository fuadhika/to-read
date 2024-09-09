"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = notFound;
function notFound(req, res, next) {
    return res
        .status(404)
        .json({ error: "The route you search for does not exist" });
}
