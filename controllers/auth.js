import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.js";
import Admin from "../models/Admin.js";
import { validateEmail, validatePassword } from "../utils/validations.js";


export const register = async (req, res, next) => {

    const { email, password, isAdmin } = req.body;



    if (!password || !email ) {
        return next(createError(400, 'All fields are required.'));
    }

    

    // T--------
    if (password?.length < 3 || password?.length > 16) {
        return next(createError(400, 'Invalid password. password must be between 3 and 16 characters.'));
    }

    
    // T--------
    if (!validatePassword(password)) {
        return next(createError(400, 'Invalid password. At least one lowercase letter,one uppercase letter,one digit,one special character,'));
    }
     // T--------
     if (!validateEmail(email)) {
        return next(createError(400, 'Invalid invalid'));
    }

    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);

    const hash = bcrypt.hashSync(password, salt);

    const newAdmin = new Admin({ email, password: hash, isAdmin })

    try {
        const savedAdmin = await newAdmin.save();

        const { password, isAdmin, ...otherDetails } = savedAdmin._doc;

        res.status(200).json(otherDetails);

    } catch (error) {

        next(error)

    }
}


export const login = async (req, res, next) => {

    const { email, password } = req.body;

    if (!password || !email ) {
        return next(createError(400, 'All fields are required.'));
    }

    

    // T--------
    if (password?.length < 3 || password?.length > 16) {
        return next(createError(400, 'Invalid password. password must be between 3 and 16 characters.'));
    }

    
    // T--------
    if (!validatePassword(password)) {
        return next(createError(400, 'Invalid password. At least one lowercase letter,one uppercase letter,one digit,one special character,'));
    }

    try {

        const admin = await Admin.findOne({ email: email });

        if (!admin) return next(createError(404, "User is not founded!"))

        const isPassword = await bcrypt.compare(req.body.password, admin.password)

        if (!isPassword) return next(createError(400, "Wrong username or password!"))

        const { password, isAdmin, ...otherDetails } = admin._doc;

        const token = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, process.env.JWT_SECRET)

        res.status(200).json({ token, otherDetails })
    } catch (error) {

        next(error)

    }
}