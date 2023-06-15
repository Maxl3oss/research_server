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
router.get("/profile", authController.GetProfile);
exports.default = router;
//# sourceMappingURL=auth.route.js.map