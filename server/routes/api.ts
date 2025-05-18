import express from "express";
import {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeatureStatus,
  voteForFeature,
  checkVoteStatus
} from "../controllers/featureController";

// Create a router
const router = express.Router();

// Feature routes
router.get("/features", getAllFeatures);
router.get("/features/:id", getFeatureById);
router.post("/features", createFeature);
router.put("/features/:id/status", updateFeatureStatus);
router.post("/features/:id/vote", voteForFeature);
router.get("/features/:id/voted", checkVoteStatus);

export default router;