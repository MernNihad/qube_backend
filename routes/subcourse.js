import express from "express";
import { createSubCourse, deleteSubCourse } from "../controllers/subcourse.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:id", verifyAdmin, createSubCourse)
// DELETE
router.delete("/:id/:subcourse", verifyAdmin, deleteSubCourse)



export default router;