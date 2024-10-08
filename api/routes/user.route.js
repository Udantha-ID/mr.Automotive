import express from "express";
import { getUser, test } from "../controllers/user.controllers.js";
import { veryfyTocken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.get("/:id", veryfyTocken, getUser);

export default router;
