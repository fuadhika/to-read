"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user-controller");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = express_1.default.Router();
router.route("/").get((0, auth_middleware_1.authorizeUser)("admin"), user_controller_1.getAllUsers);
router
    .route("/:id")
    .get(user_controller_1.getSingleUser)
    .put(auth_middleware_1.checkOwnership, user_controller_1.editUser)
    .delete(auth_middleware_1.checkOwnership, user_controller_1.deleteUser);
exports.default = router;
