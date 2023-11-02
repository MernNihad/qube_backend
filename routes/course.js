import express from "express";
import { createCourse, deleteCourse, getCourse, getCourses,updateCourse } from "../controllers/course.js"
import { verifyAdmin } from "../utils/verifyToken.js";
// createRoom,
// deleteRoom,
// getRoom,
// getRooms,
// updateRoom

const router = express.Router();

// CREATE
router.post("/", verifyAdmin, createCourse) // T-------
// UPDATE
router.put("/:id", verifyAdmin, updateCourse) // T-------
// DELETE
router.delete("/:id", verifyAdmin, deleteCourse) 
// GET
router.get("/:id", getCourse)
// GET ALL
router.get("/", getCourses) // T-------


export default router;