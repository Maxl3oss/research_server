import express from "express";
import * as researchController from "../controllers/research.controller";
const router = express.Router();
require("dotenv").config();
import iMulter from "../utils/multer.util";

router.post("/create",
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.Create);

router.post("/upload",
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.UploadImageToCloud);

router.put("/update/:id", 
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.UpdateResearch);

router.get("/get-all", researchController.GetResearch);
router.get("/get-detail/:userId", researchController.GetResearchDetailById);
router.get("/get/:userId", researchController.GetResearchByUserId);

router.post("/rating/:researchId", researchController.RatingStarsResearch);

router.delete("/delete/:id", researchController.DeleteResearch);

export default router;

