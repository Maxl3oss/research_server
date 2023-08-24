import express from "express";
import * as researchController from "../controllers/research.controller";
const router = express.Router();
require("dotenv").config();
import iMulter from "../utils/multer.util";

router.post("/create",
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.Create);

router.post("/upload", iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), researchController.UploadImageToCloud);

router.get("/get-all", researchController.GetResearch);
router.get("/update", researchController.UpdateResearch);
router.delete("/delete/:id", researchController.DeleteResearch);

export default router;
