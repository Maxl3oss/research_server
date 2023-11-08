"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likeController = require("../controllers/likes.controller");
const router = express_1.default.Router();
require("dotenv").config();
router.post("/like-research/:userId", likeController.LikeResearch);
exports.default = router;
//# sourceMappingURL=likes.routes.js.map