import express from "express";
import {
  createReorderRequest,
  getLowStockItems,
  getReorders,
  updateReorderStatus,
  deleteReorderRequest
} from "../controllers/reorderController.js";

const router = express.Router();

router.post("/reorder", createReorderRequest);
router.get("/low-stock", getLowStockItems);
router.get("/get", getReorders);
router.put("/updateReorderStatus/:id", updateReorderStatus);
router.delete("/deleteReorder/:id", deleteReorderRequest); // Add delete route



export default router;
