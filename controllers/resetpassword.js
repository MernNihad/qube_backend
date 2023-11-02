import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.js";
import Admin from "../models/Admin.js";
import { validateEmail, validatePassword, validatePhoneNumber } from "../utils/validations.js";
import Student from "../models/Student.js";


export const isMatchEmailPassword = async (req, res, next) => {

    try {

        
        const { email, phoneNumber, isUserType } = req.body;
        console.log(email,phoneNumber,isUserType);

        if (!phoneNumber) return next(createError(400, 'phoneNumber is required'))
        if (!email) return next(createError(400, 'email is required'))

        // T--------
        if (!validatePhoneNumber(phoneNumber)) {
            return next(createError(400, 'Invalid phoneNumber,'));
        }
        // T--------
        if (!validateEmail(email)) {
            return next(createError(400, 'Invalid Email'));
        }

        if (!isUserType) return next(createError(400, 'isUserType is required'))



        if (isUserType === 'isStudent') {
            const isStudent = await Student.findOne({ email, phoneNumber });
            if (!isStudent) return next(createError(400, 'Account not found'))

            const token = jwt.sign({ id: isStudent._id, isStudent: isStudent.isStudent }, process.env.JWT_SECRET)
            res.status(200).json({ result: isStudent, success: true, isMatch: true, token });

        }

        if (isUserType === 'isTrainer') {
            const isTrainer = await Trainer.findOne({ email, phoneNumber });
            if (!isTrainer) return next(createError(400, 'Account not found'))

            const token = jwt.sign({ id: isTrainer._id, isTrainer: isTrainer.isTrainer }, process.env.JWT_SECRET)
            res.status(200).json({ result: isTrainer, success: true, isMatch: true, token });

        }

        // const saltRounds = 10;

        // const salt = bcrypt.genSaltSync(saltRounds);

        // const hash = bcrypt.hashSync(password, salt);


        //     const savedAdmin = await newAdmin.save();

        //     const { password, isAdmin, ...otherDetails } = savedAdmin._doc;

        //     res.status(200).json(otherDetails);

    } catch (error) {

        next(error)

    }
}


export const forgotPassword = async (req, res, next) => {



    try {

    const { password,token } = req.body;


        if (!password ) {
            return next(createError(400, 'password are required.'));
        }
    
    
    
        // T--------
        if (password?.length < 3 || password?.length > 16) {
            return next(createError(400, 'Invalid password. password must be between 3 and 16 characters.'));
        }
    
    
        // T--------
        if (!validatePassword(password)) {
            return next(createError(400, 'Invalid password. At least one lowercase letter,one uppercase letter,one digit,one special character,'));
        }





    if (!token) {
        return next(createError(401, "Your are not authenticated!"))
    }

    jwt.verify(token, process.env.JWT_SECRET, async(err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));

        console.log('unlocked');
        console.log(user,'user');

        const salt = bcrypt.genSaltSync(10);

        const hash = bcrypt.hashSync(password, salt);
    

        if(user?.isTrainer){

            const updatedOne = await Trainer.findByIdAndUpdate(user.id, { $set: { password:hash } }, { new: true });
            res.status(200).json(updatedOne);
        }

        if(user?.isStudent){
            const updatedOne = await Student.findByIdAndUpdate(user.id, { $set: { password:hash } }, { new: true });
            res.status(200).json(updatedOne);

        }




        return true
    })


  


        // const admin = await Admin.findOne({ email: email });

        // if (!admin) return next(createError(404, "User is not founded!"))

        // const isPassword = await bcrypt.compare(req.body.password, admin.password)

        // if (!isPassword) return next(createError(400, "Wrong username or password!"))

        // const { password, isAdmin, ...otherDetails } = admin._doc;

        // const token = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, process.env.JWT_SECRET)

        // res.status(200).json({ token, otherDetails })
    } catch (error) {

        next(error)

    }
}