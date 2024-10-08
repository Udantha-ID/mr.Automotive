import express from "express";
import {
  createMaintancePkg,
  getAllMaintancePkg,
  getMaintancePkg,
  deleteMaintancePkg,
  updateMaintancePkg,
} from "../controllers/MaintancePkg.controller.js";

const router = express.Router();

router.post("/add", createMaintancePkg);
router.get("/get", getAllMaintancePkg);
router.get("/get/:id", getMaintancePkg);
router.delete("/del/:id", deleteMaintancePkg);
router.put("/update/:id", updateMaintancePkg);

export default router;
