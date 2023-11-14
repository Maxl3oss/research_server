"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = require("../controllers/user.controller");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_util_1 = __importDefault(require("../utils/multer.util"));
require("dotenv").config();
router.put("/change-profile/:id", multer_util_1.default.uploads.fields([{ name: 'profile', maxCount: 1 }]), authMiddleware_1.authenticateJWT, userController.ChangeProfile);
router.get("/get-profile/:id", authMiddleware_1.authenticateJWT, userController.GetProfile);
// admin
router.get("/managements/get-all", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userController.GetUsersAll);
router.get("/managements/get/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userController.GetUserById);
router.delete("/managements/delete-user/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userController.DeleteUsersById);
router.put("/managements/verify/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userController.verifyUserById);
exports.default = router;
//# sourceMappingURL=user.routes.js.map