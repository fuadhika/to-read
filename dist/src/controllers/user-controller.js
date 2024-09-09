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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getSingleUser = getSingleUser;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['User']
        try {
            const users = yield prisma.user.findMany();
            return res.status(200).json({ message: "OK", data: users });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getSingleUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['User']
        try {
            const { id } = req.params;
            const user = yield prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (!user)
                return res
                    .status(404)
                    .json({ error: `User with ID: ${id} does not exist` });
            return res.status(200).json({ message: "OK", data: user });
        }
        catch (error) {
            return next(error);
        }
    });
}
function editUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['User']
        try {
            const { id } = req.params;
            const { fullName } = req.body;
            yield prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    fullName,
                },
            });
            return res.status(200).json({ message: "OK" });
        }
        catch (error) {
            return next(error);
        }
    });
}
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['User']
        try {
            const { id } = req.params;
            yield prisma.user.delete({
                where: { id: id },
            });
            res.clearCookie("token");
            req.user = null;
            return res.status(200).json({ message: "OK" });
        }
        catch (error) {
            return next(error);
        }
    });
}
