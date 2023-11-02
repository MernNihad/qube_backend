import express from "express";
import { createCourse, deleteCourse, getCourse, getCourses,updateCourse } from "../controllers/course.js"
import { verifyAdmin } from "../utils/verifyToken.js";
import { piecoursecount, studentscount, subcoursecount, trainerscount } from "../controllers/count.js";
// createRoom,
// deleteRoom,
// getRoom,
// getRooms,
// updateRoom

const router = express.Router();

// CREATE
router.get("/subcoursecount", verifyAdmin, subcoursecount) // T-------
// UPDATE
router.get("/trainercount", verifyAdmin, trainerscount) // T-------
// DELETE
router.get("/studentcount", verifyAdmin, studentscount) 
router.get("/piecoursecount", verifyAdmin, piecoursecount) 
// GET
// router.get("/:id", getCourse)
// GET ALL
// router.get("/", getCourses) // T-------


export default router;