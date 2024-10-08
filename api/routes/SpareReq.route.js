import express from "express";
import {
  createSpareReq,
  getAllSparePartsRequests,
  updateStatus,
  deleteSpareReq
} from "../controllers/SpareReq.controller.js";

const router = express.Router();

router.post("/add", createSpareReq);
router.get("/get", getAllSparePartsRequests);
router.put("/:id/status", updateStatus);
router.delete("/delete/:id", deleteSpareReq);

export default router;
