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
            // Create roles
            const adminRole = yield prisma.role.create({
                data: { name: "admin" },
            });
            const userRole = yield prisma.role.create({
                data: { name: "user" },
            });
            // Create users and store their IDs
            const adminUser = yield prisma.user.create({
                data: {
                    fullName: "Admin",
                    email: "admin@email.com",
                    isEmailConfirmed: true,
                    password: yield (0, bcrypt_1.hash)("adminpass", salt),
                    roleId: adminRole.id,
                },
            });
            const janeSmith = yield prisma.user.create({
                data: {
                    fullName: "Jane Smith",
                    email: "jane.smith@email.com",
                    isEmailConfirmed: true,
                    password: yield (0, bcrypt_1.hash)("janepass", salt),
                    roleId: userRole.id,
                },
            });
            const michaelJohnson = yield prisma.user.create({
                data: {
                    fullName: "Michael Johnson",
                    email: "michael.johnson@email.com",
                    isEmailConfirmed: true,
                    password: yield (0, bcrypt_1.hash)("michaelpass", salt),
                    roleId: userRole.id,
                },
            });
            const johnDoe = yield prisma.user.create({
                data: {
                    fullName: "John Doe",
                    email: "john.doe@email.com",
                    isEmailConfirmed: true,
                    password: yield (0, bcrypt_1.hash)("johnpass", salt),
                    roleId: userRole.id,
                },
            });
            // Create books, using the IDs from the created users
            yield prisma.book.createMany({
                data: [
                    { title: "Moby Dick", author: "Herman Melville", userId: janeSmith.id },
                    {
                        title: "Pride and Prejudice",
                        author: "Jane Austen",
                        userId: janeSmith.id,
                    },
                    { title: "1984", author: "George Orwell", userId: michaelJohnson.id },
                    {
                        title: "To Kill a Mockingbird",
                        author: "Harper Lee",
                        userId: michaelJohnson.id,
                    },
                    {
                        title: "The Great Gatsby",
                        author: "F. Scott Fitzgerald",
                        userId: michaelJohnson.id,
                    },
                    { title: "War and Peace", author: "Leo Tolstoy", userId: johnDoe.id },
                    {
                        title: "The Catcher in the Rye",
                        author: "J.D. Salinger",
                        userId: johnDoe.id,
                    },
                    {
                        title: "Brave New World",
                        author: "Aldous Huxley",
                        userId: johnDoe.id,
                    },
                    { title: "The Hobbit", author: "J.R.R. Tolkien", userId: johnDoe.id },
                    {
                        title: "Crime and Punishment",
                        author: "Fyodor Dostoevsky",
                        userId: johnDoe.id,
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
