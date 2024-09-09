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
exports.register = register;
exports.confirmEmail = confirmEmail;
exports.login = login;
exports.logout = logout;
const client_1 = require("@prisma/client");
const resend_1 = require("resend");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Authentication']
        try {
            const { fullName, email, password } = req.body;
            if (!fullName || !email || !password)
                return res.status(400).json({ error: "Missing required fields" });
            const emailRecord = yield prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (emailRecord)
                return res.status(400).json({ error: "Email already been used" });
            const userRole = yield prisma.role.findUnique({
                where: { name: "user" },
            });
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const user = yield prisma.user.create({
                data: {
                    fullName,
                    email,
                    password: yield (0, bcrypt_1.hash)(password, salt),
                    roleId: userRole.id,
                },
            });
            const token = crypto_1.default.randomBytes(32).toString("hex");
            const confirmationLink = `http://localhost:${process.env.PORT}/api/v1/auth/confirm-email?token=${token}`;
            yield prisma.registrationToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
                },
            });
            const { data, error } = yield resend.emails.send({
                from: "Express CRUD <tutorial@killthemagic.dev>",
                to: [email],
                subject: "Express CRUD Confirmation",
                html: `<p>Please confirm your email using this <a href=${confirmationLink}>link.</a> Thank you!<p>`,
            });
            if (error)
                return res.status(400).json({ error });
            return res.status(200).json({ message: "OK", data });
        }
        catch (error) {
            return next(error);
        }
    });
}
function confirmEmail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Authentication']
        try {
            const { token } = req.query;
            if (!token)
                return res.status(400).json({ error: "No token provided" });
            const tokenRecord = yield prisma.registrationToken.findUnique({
                where: { token: token.toString() },
            });
            if (!tokenRecord ||
                tokenRecord.expiresAt < new Date() ||
                tokenRecord.isTokenUsed)
                return res.status(400).json({ error: "Invalid or expired token" });
            yield prisma.registrationToken.update({
                where: { id: tokenRecord.id },
                data: { isTokenUsed: true },
            });
            yield prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { isEmailConfirmed: true },
            });
            return res.status(200).json({ message: "OK" });
        }
        catch (error) {
            return next(error);
        }
    });
}
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Authentication']
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ error: "Missing required fields" });
            const user = yield prisma.user.findUnique({
                where: {
                    email,
                },
                include: { Role: true },
            });
            if (!user || !user.isEmailConfirmed)
                return res.status(404).json({
                    error: "Unconfirmed email or user not found",
                });
            const isValidPassword = yield (0, bcrypt_1.compare)(password, user.password);
            if (!isValidPassword)
                return res.status(400).json({
                    error: "Invalid credentials",
                });
            const jwtPayload = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                roleId: user.roleId,
                roleName: user.Role.name,
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET_KEY, {
                expiresIn: "30d",
            });
            return res
                .cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                sameSite: "none",
                secure: true,
            })
                .status(200)
                .json({ message: "OK" });
        }
        catch (error) {
            return next(error);
        }
    });
}
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Authentication']
        try {
            res.clearCookie("token");
            req.user = null;
            return res.status(200).json({ message: "OK" });
        }
        catch (error) {
            return next(error);
        }
    });
}
