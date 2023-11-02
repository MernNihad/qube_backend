import express from "express";
import {
    createTrainer,
    deleteTrainer,
    getTrainer,
    getTrainerNameById,
    getTrainers,
    loginTrainer,
    updateTrainer,
} from "../controllers/trainer.js";
import { verifyAdmin, verifyAdminOrStudentorTrainerRole, verifyAdminOrTrainerRole } from "../utils/verifyToken.js";

const router = express.Router();

// REGISTER
router.post("/register", verifyAdmin, createTrainer) // to create trainer
// LOGIN
router.post("/login", loginTrainer) // to create trainer
// update
router.put("/:id", verifyAdminOrTrainerRole, updateTrainer) // to create trainer
// DALETE
router.delete("/:id", verifyAdmin, deleteTrainer) // to create trainer
// get
router.get("/:id", verifyAdminOrTrainerRole, getTrainer) // to create trainer
// get all
router.get("/", verifyAdmin, getTrainers) // to create trainer

router.get("/namebyid/:id", verifyAdminOrStudentorTrainerRole, getTrainerNameById) // to get trainer name with id



// verifyAdminOrTrainerRole


export default router;