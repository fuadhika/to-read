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
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const adminRole = yield prisma.role.create({
                data: { name: "admin" },
            });
            const userRole = yield prisma.role.create({
                data: { name: "user" },
            });
            yield prisma.user.createMany({
                data: [
                    {
                        fullName: "Admin",
                        email: "admin@email.com",
                        isEmailConfirmed: true,
                        password: yield (0, bcrypt_1.hash)("adminpass", salt),
                        roleId: adminRole.id,
                    },
                    {
                        fullName: "Jane Smith",
                        email: "jane.smith@email.com",
                        isEmailConfirmed: true,
                        password: yield (0, bcrypt_1.hash)("janepass", salt),
                        roleId: userRole.id,
                    },
                    {
                        fullName: "Michael Johnson",
                        email: "michael.johnson@email.com",
                        isEmailConfirmed: true,
                        password: yield (0, bcrypt_1.hash)("michaelpass", salt),
                        roleId: userRole.id,
                    },
                    {
                        fullName: "John Doe",
                        email: "john.doe@email.com",
                        isEmailConfirmed: true,
                        password: yield (0, bcrypt_1.hash)("johnpass", salt),
                        roleId: userRole.id,
                    },
                ],
            });
            yield prisma.book.createMany({
                data: [
                    { title: "Moby Dick", author: "Herman Melville", userId: 2 },
                    { title: "Pride and Prejudice", author: "Jane Austen", userId: 2 },
                    { title: "1984", author: "George Orwell", userId: 3 },
                    { title: "To Kill a Mockingbird", author: "Harper Lee", userId: 3 },
                    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", userId: 3 },
                    { title: "War and Peace", author: "Leo Tolstoy", userId: 4 },
                    { title: "The Catcher in the Rye", author: "J.D. Salinger", userId: 4 },
                    { title: "Brave New World", author: "Aldous Huxley", userId: 4 },
                    { title: "The Hobbit", author: "J.R.R. Tolkien", userId: 4 },
                    {
                        title: "Crime and Punishment",
                        author: "Fyodor Dostoevsky",
                        userId: 4,
                    },
                ],
            });
            console.log("Seed data successfully inserted");
        }
        catch (error) {
            console.error(error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
seed();
