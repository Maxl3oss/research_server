"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagsController = require("../controllers/tags.controller");
const router = express_1.default.Router();
require("dotenv").config();
router.get("/get-ddl", tagsController.GetTags);
exports.default = router;
//# sourceMappingURL=tags.routes.js.map