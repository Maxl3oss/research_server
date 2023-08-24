"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController = require("../controllers/auth.controller");
const router = express_1.default.Router();
require("dotenv").config();
router.post("/login", authController.Login);
router.post("/register", authController.Register);
router.get("/verify-email", authController.verifyEmail);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map