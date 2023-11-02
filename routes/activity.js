import express from "express";
import {
    createActivity,
    createAnswer,
    evaluationAnswer,
    // getActivity,
    // getActivities,
    getActivity,
    // loginActivity,
    // registerActivity,
    // updateActivity,
} from "../controllers/activity.js";
import { verifyAdmin,  verifyAdminOrStudentRole,  verifyAdminOrStudentorTrainerRole,  verifyAdminOrTrainerRole } from "../utils/verifyToken.js";

const router = express.Router();
// REGISTER
router.post("/", verifyAdminOrTrainerRole, createActivity) // to create Activity
// answer
router.post("/answer", verifyAdminOrStudentorTrainerRole,createAnswer) // to create Activity
router.post("/evaluate", verifyAdminOrStudentRole,evaluationAnswer) // to create Activity

router.get("/", verifyAdminOrStudentorTrainerRole, getActivity) // to create Activity

export default router;