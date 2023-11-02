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
<<<<<<< HEAD
router.get("/", verifyAdminOrStudentorTrainerRole,getAttendances)
router.get("/counts", verifyAdminOrStudentorTrainerRole,getAttendancesCount)
=======
router.get("/:id", verifyAdminOrStudentorTrainerRole,getAttendances)

>>>>>>> 80373be282c0f9b2611fcf0a90ee01e67baa3207

export default router;