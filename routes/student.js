import express from "express";
import {
    deleteStudent,
    getAllStudents,
    getAllStudentsByTrainer,
    getStudent,
    getStudents,
    loginStudent,
    registerStudent,
    updateStudent,
} from "../controllers/student.js";
import { verifyAdmin, verifyAdminOrStudentRole, verifyAdminOrStudentorTrainerRole, verifyAdminOrTrainerRole } from "../utils/verifyToken.js";

const router = express.Router();
// REGISTER
router.post("/register", verifyAdmin, registerStudent) // to create Student
// LOGIN
router.post("/login", loginStudent) // to create Student
// update
router.put("/:id", verifyAdminOrStudentRole, updateStudent) // to create Student
// DALETE
router.delete("/:id", verifyAdmin, deleteStudent) // to create Student
// get
router.get("/:id", verifyAdminOrStudentorTrainerRole, getStudent) // to create Student
// get all
router.get("/", verifyAdmin, getStudents) // to create Student
router.get("/students/:id", verifyAdminOrTrainerRole, getAllStudents) // get all students under trainer
router.get("/studentsby/:trainerid/:courseid", verifyAdminOrTrainerRole, getAllStudentsByTrainer) // get all students under trainer
router.get("/studentsby/:trainerid", verifyAdminOrTrainerRole, getAllStudentsByTrainer) // get all students under trainer

export default router;