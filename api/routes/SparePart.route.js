import express from "express";
import {
  createSparePart,
  deleteSparePart,
  getAllSpareParts,
  getOnePart,
  searchSpareParts,
  updateSparePart,
} from "../controllers/SparePart.controller.js";

const router = express.Router();

router.post("/add", createSparePart);
router.get("/", getAllSpareParts); // Fetch all parts
router.put("/update/:id", updateSparePart); // Update part by ID
router.delete("/delete/:id", deleteSparePart); // Delete part by ID
router.get("/search", searchSpareParts); // Search parts by query
router.get("/:id", getOnePart); // Search parts by query

export default router;
