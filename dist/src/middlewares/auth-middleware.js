"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
exports.authorizeUser = authorizeUser;
exports.checkOwnership = checkOwnership;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.cookies;
            if (!token)
                return res.status(400).json({ error: "Please login first" });
            const tokenPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            if (!tokenPayload)
                return res.status(401).json({ error: "Invalid or expired token" });
            req.user = {
                id: tokenPayload.id,
                fullName: tokenPayload.fullName,
                email: tokenPayload.email,
                roleId: tokenPayload.roleId,
                roleName: tokenPayload.roleName,
            };
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
function authorizeUser(...roles) {
    return function (req, res, next) {
        var _a;
        try {
            if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.roleName))
                return res.status(403).json({ error: "Access denied" });
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
}
function checkOwnership(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.roleName) === "admin")
                return next();
            const { id } = req.params;
            const path = req.originalUrl.split("/")[3];
            if (path === "books") {
                const book = yield prisma.book.findUnique({
                    where: { id: Number(id) },
                    include: { User: true },
                });
                if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) !== (book === null || book === void 0 ? void 0 : book.User.id))
                    return res.status(403).json({ error: "Access denied" });
            }
            if (path === "users") {
                const user = yield prisma.user.findUnique({
                    where: { id: Number(id) },
                });
                if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) !== (user === null || user === void 0 ? void 0 : user.id))
                    return res.status(403).json({ error: "Access denied" });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
