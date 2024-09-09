"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book-controller");
const auth_middleware_1 = require("../middlewares/auth-middleware");
/* --------------------------- Schema Informations -------------------------- */
/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated ID of the book
 *        title:
 *          type: string
 *          description: The title of the book
 *        author:
 *          type: string
 *          description: The book author
 *        createdAt:
 *          type: string
 *          format: date
 *          description: The date the book was added
 *      example:
 *        id: 1725426103540
 *        title: Mobby Dick
 *        author: Herman Melville
 *        createdAt: 2024-09-04T05:01:43.540Z
 */
/* -------------------------- Endpoint Informations ------------------------- */
/**
 * @swagger
 * tags:
 *  name: Books
 *  description: The books managing API
 * /books:
 *  post:
 *    summary: Add new book
 *    tags: [Books]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Book"
 *    responses:
 *      201:
 *        description: The created book
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Book"
 *      500:
 *        description: General server error
 *
 */
const router = express_1.default.Router();
router.route("/").get((0, auth_middleware_1.authorizeUser)("admin"), book_controller_1.getAllBooks).post(book_controller_1.addBook);
router
    .route("/:id")
    .all(auth_middleware_1.checkOwnership)
    .get(book_controller_1.getSingleBook)
    .put(book_controller_1.editBook)
    .delete(book_controller_1.deleteBook);
exports.default = router;
