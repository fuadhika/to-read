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
exports.getAllBooks = getAllBooks;
exports.getSingleBook = getSingleBook;
exports.addBook = addBook;
exports.editBook = editBook;
exports.deleteBook = deleteBook;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getAllBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Book']
        try {
            const books = yield prisma.book.findMany();
            return res.status(200).json({ message: "OK", data: books });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        }
    });
}
function getSingleBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Book']
        try {
            const { id } = req.params;
            const book = yield prisma.book.findUnique({
                where: {
                    id: Number(id),
                },
                include: { User: true },
            });
            if (!book)
                return res
                    .status(404)
                    .json({ error: `Book with ID: ${id} is not exist` });
            return res.status(200).json({ message: "OK", data: book });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        }
    });
}
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Book']
        try {
            const { title, author } = req.body;
            if (!title || !author)
                return res.status(400).json({ error: "Required fields is missing" });
            const newBook = yield prisma.book.create({
                data: {
                    title,
                    author,
                    userId: req.user.id,
                },
            });
            return res.status(201).json({ message: "OK", data: newBook });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        }
    });
}
function editBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Book']
        try {
            const { id } = req.params;
            const { title, author, finished } = req.body;
            const book = yield prisma.book.update({
                where: {
                    id: Number(id),
                },
                data: {
                    title,
                    author,
                    finished,
                },
            });
            return res.status(200).json({ message: "OK", data: book });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        }
    });
}
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Book']
        try {
            const { id } = req.params;
            yield prisma.book.delete({
                where: {
                    id: Number(id),
                },
            });
            return res.status(200).json({ message: "OK" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        }
    });
}
