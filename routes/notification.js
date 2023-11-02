import express from "express";
import {
    createNotification,
    deleteNotification,
    getNotifications
} from "../controllers/notification.js";
import { verifyAdmin, verifyAdminOrStudentorTrainerRole } from "../utils/verifyToken.js";

const router = express.Router();
// REGISTER
router.post("/", verifyAdmin, createNotification) // to create Student
// DALETE
router.delete("/:id", verifyAdmin, deleteNotification) // to create Student
// get all
router.get("/", verifyAdminOrStudentorTrainerRole, getNotifications) // to create Student

export default router;