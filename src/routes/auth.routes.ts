import express from "express";
import authController = require("../controllers/auth.controller");
const router = express.Router();
require("dotenv").config();

router.post("/login", authController.Login);
router.post("/register", authController.Register);
router.get("/verify-email", authController.verifyEmail);

export default router;
