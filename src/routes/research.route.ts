import express from "express";
import * as researchController from "../controllers/research.controller";
const router = express.Router();
require("dotenv").config();
import iMulter from "../interface/multer.interface";

router.post("/create",
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.Create);

router.post("/upload", iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.UploadImageToCloud);

router.get("/get/:page/:pageSize", researchController.GetResearch);
router.get("/update", researchController.UpdateResearch);

export default router;
