import express from "express";
import likeController = require("../controllers/likes.controller");
const router = express.Router();
require("dotenv").config();

router.post("/like-research/:userId", likeController.LikeResearch);

export default router;
