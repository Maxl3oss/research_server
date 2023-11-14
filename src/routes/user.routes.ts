import express from "express";
import userController = require("../controllers/user.controller");
const router = express.Router();
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';
import iMulter from "../utils/multer.util";
require("dotenv").config();

router.put("/change-profile/:id",
  iMulter.uploads.fields([{ name: 'profile', maxCount: 1 }]),
  authenticateJWT, userController.ChangeProfile);

router.get("/get-profile/:id", authenticateJWT, userController.GetProfile);

// admin
router.get("/managements/get-all", authenticateJWT, authorizeAdmin, userController.GetUsersAll);
router.get("/managements/get/:id", authenticateJWT, authorizeAdmin, userController.GetUserById);
router.delete("/managements/delete-user/:id", authenticateJWT, authorizeAdmin, userController.DeleteUsersById);
router.put("/managements/verify/:id", authenticateJWT, authorizeAdmin, userController.verifyUserById);

export default router;
