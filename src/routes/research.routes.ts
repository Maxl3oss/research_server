import express from "express";
import * as researchController from "../controllers/research.controller";
const router = express.Router();
import iMulter from "../utils/multer.util";
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

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

// admin
router.get("/managements/get-all", authenticateJWT, authorizeAdmin, researchController.GetResearchAll);
router.post("/managements/verify-research/:id", authenticateJWT, authorizeAdmin, researchController.VerifyResearchById);
router.put("/managements/update/:id", authenticateJWT, authorizeAdmin,
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.UpdateResearch);

export default router;