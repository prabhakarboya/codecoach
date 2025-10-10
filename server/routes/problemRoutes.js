import express from "express";
import { getProblems, getProblemById, addProblem } from "../controllers/problemController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", getProblems);
router.get("/:id", getProblemById);
router.post("/add", protect, addProblem); // protected, admin only

export default router;
