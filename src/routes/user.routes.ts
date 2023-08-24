import express from "express";
import userController = require("../controllers/user.controller");
const router = express.Router();
require("dotenv").config();

router.get("/fetch-user", userController.GetProfile);

export default router;
