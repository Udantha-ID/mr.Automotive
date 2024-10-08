import express from "express";
import {
  createReorderRequest,
  getLowStockItems,
  getReorders,
  updateReorderStatus,
} from "../controllers/reorderController.js";

const router = express.Router();

router.post("/reorder", createReorderRequest);
router.get("/low-stock", getLowStockItems);
router.get("/get", getReorders);
router.put("/updateReorderStatus/:id", updateReorderStatus);


export default router;
