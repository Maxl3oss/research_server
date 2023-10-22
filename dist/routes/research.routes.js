"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const researchController = __importStar(require("../controllers/research.controller"));
const router = express_1.default.Router();
require("dotenv").config();
const multer_util_1 = __importDefault(require("../utils/multer.util"));
router.post("/create", multer_util_1.default.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.Create);
router.post("/upload", multer_util_1.default.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.UploadImageToCloud);
router.put("/update/:id", multer_util_1.default.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.UpdateResearch);
router.get("/get-all", researchController.GetResearch);
router.get("/get-detail/:userId", researchController.GetResearchDetailById);
router.get("/get/:userId", researchController.GetResearchByUserId);
router.post("/rating/:researchId", researchController.RatingStarsResearch);
router.delete("/delete/:id", researchController.DeleteResearch);
exports.default = router;
//# sourceMappingURL=research.routes.js.map