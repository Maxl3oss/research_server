import express from "express";
import tagsController = require("../controllers/tags.controller");
const router = express.Router();
require("dotenv").config();

router.get("/get-ddl", tagsController.GetTags);

export default router;
