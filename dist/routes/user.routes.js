"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = require("../controllers/user.controller");
const router = express_1.default.Router();
require("dotenv").config();
router.get("/fetch-user", userController.GetProfile);
exports.default = router;
//# sourceMappingURL=user.routes.js.map