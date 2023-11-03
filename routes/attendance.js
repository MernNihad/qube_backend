import express from "express";
import { createAttendance, getAttendances, getAttendancesCount } from "../controllers/attendance.js";
import { verifyAdmin, verifyAdminOrStudentorTrainerRole } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyAdminOrStudentorTrainerRole, createAttendance)
// UPDATE
// router.put("/:id", verifyAdmin, updateAttendance)
// DELETE
// router.delete("/:id", verifyAdmin, deleteAttendance)
// GET
// router.get("/:id", getAttendance)
// GET ALL

router.get("/", verifyAdminOrStudentorTrainerRole,getAttendances)
router.get("/counts", verifyAdminOrStudentorTrainerRole,getAttendancesCount)

router.get("/:id", verifyAdminOrStudentorTrainerRole,getAttendances)
export default router;