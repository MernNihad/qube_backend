import express from "express";
import {
    login,
    register,
    getAdmin
} from "../controllers/auth.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/register", register)
// LOGIN
router.post("/login", login)

router.get("/:id", verifyAdmin, getAdmin) // to create trainer

export default router;