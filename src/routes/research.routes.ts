import express from "express";
import * as researchController from "../controllers/research.controller";
import * as commentController from "../controllers/comment.controller";
const router = express.Router();
import iMulter from "../utils/multer.util";
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

router.post("/create", authenticateJWT,
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.Create);

router.post("/extract", authenticateJWT,
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.UploadExtractFile);

router.put("/update/:id", authenticateJWT,
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.UpdateResearch);

router.get("/get-all", researchController.GetResearch);
router.get("/get-detail/:userId", researchController.GetResearchDetailById);
router.get("/get/:userId", researchController.GetResearchByUserId);

router.post("/rating/:researchId", authenticateJWT, researchController.RatingStarsResearch);

router.delete("/delete/:id", researchController.DeleteResearch);

// admin
router.get("/managements/get-dashboard", authenticateJWT, authorizeAdmin, researchController.GetDashboard);
router.get("/managements/get-all", authenticateJWT, authorizeAdmin, researchController.GetResearchAll);
router.post("/managements/verify-research/:id", authenticateJWT, authorizeAdmin, researchController.VerifyResearchById);
router.put("/managements/update/:id", authenticateJWT, authorizeAdmin,
  iMulter.uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  researchController.UpdateResearch);

// comments 
router.get("/get-comments/:id", commentController.GetCommentsByIdResearch);
router.post("/create-comment", commentController.Create);

export default router;