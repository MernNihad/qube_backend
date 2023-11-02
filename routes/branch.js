import express from "express";
import { createBranch, deleteBranch, getBranch, getBranchs, updateBranch } from "../controllers/branch.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyAdmin, createBranch)
// UPDATE
router.put("/:id", verifyAdmin, updateBranch)
// DELETE
router.delete("/:id", verifyAdmin, deleteBranch)
// GET
router.get("/:id", getBranch)
// GET ALL
router.get("/", getBranchs)


export default router;