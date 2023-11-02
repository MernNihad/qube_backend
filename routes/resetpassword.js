import express from "express";
import {
    
    isMatchEmailPassword,
    forgotPassword
} from "../controllers/resetpassword.js";

const router = express.Router();

// CREATE
router.post("/", isMatchEmailPassword)
// LOGIN
router.post("/reset", forgotPassword)

export default router;