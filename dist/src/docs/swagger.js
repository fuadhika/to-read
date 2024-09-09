"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: "Express.js REST API Documentation with Swagger",
        version: "0.1.0",
        description: "This is a simple CRUD API application made with Express.js application and documented using Swagger",
        license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
            name: "John Doe",
            url: "https://johndoe.com",
            email: "john.doe@email.com",
        },
    },
    servers: [
        {
            url: "http://localhost:8000",
            description: "Development server",
        },
    ],
    tags: [{ name: "Authentication" }, { name: "User" }, { name: "Book" }],
};
const outputFile = "./swagger-output.json";
const routes = ["../index.ts"];
/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
(0, swagger_autogen_1.default)({ openapi: "3.0.0" })(outputFile, routes, doc);
