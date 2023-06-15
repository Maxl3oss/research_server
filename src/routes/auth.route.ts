import express from "express";
import authController = require("../controllers/auth.controller");
const router = express.Router();
require("dotenv").config();

router.post("/login", authController.Login);
router.get("/profile", authController.GetProfile);

export default router;
