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
const multer_util_1 = __importDefault(require("../utils/multer.util"));
const authMiddleware_1 = require("../middleware/authMiddleware");
router.post("/create", multer_util_1.default.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.Create);
router.post("/extract", multer_util_1.default.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.UploadExtractFile);
router.put("/update/:id", multer_util_1.default.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.UpdateResearch);
router.get("/get-all", researchController.GetResearch);
router.get("/get-detail/:userId", researchController.GetResearchDetailById);
router.get("/get/:userId", researchController.GetResearchByUserId);
router.post("/rating/:researchId", researchController.RatingStarsResearch);
router.delete("/delete/:id", researchController.DeleteResearch);
// admin
router.get("/managements/get-dashboard", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, researchController.GetDashboard);
router.get("/managements/get-all", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, researchController.GetResearchAll);
router.post("/managements/verify-research/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, researchController.VerifyResearchById);
router.put("/managements/update/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, multer_util_1.default.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.UpdateResearch);
exports.default = router;
//# sourceMappingURL=research.routes.js.map