import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.js";
import Student from "../models/Student.js";
import { validateEmail, validateName, validatePassword, validatePhoneNumber } from "../utils/validations.js";
import Course from "../models/Course.js";



export const createTrainer = async (req, res, next) => {

    const { joinedDate, email, password, phoneNumber, branchRef, name, courseRef, } = req.body;

    try {

        if (!(joinedDate)) {
            throw createError(400, 'joined date required.');
        }

        if (validateEmail(email) && validateName(name) && validatePhoneNumber(phoneNumber) && validatePassword(password)) {
            if (!(name.length >= 3 && name.length <= 50)) {
                throw createError(400, 'Name must be between 3 and 50 characters.');
            }

            if (password.length < 8 || password.length > 50) {
                throw createError(400, 'Password must be between 8 and 50 characters.');
            }

            const existingTrainer = await Trainer.findOne({ email });
            if (existingTrainer) {
                throw createError(200, 'Email is already in use.');
            }

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);

            const newTrainer = new Trainer({ email, password: hash, phoneNumber, branchRef, name, courseRef, joinedDate });

            const savedTrainer = await newTrainer.save();

            const { password: _, ...otherDetails } = savedTrainer?._doc;
            res.status(200).json(otherDetails);
        } else {
            throw createError(400, 'Invalid input. Please check your email, name, and phone number.');
        }
    } catch (error) {
        next(error);
    }

}



// Update Trainer
export const updateTrainer = async (req, res, next) => {

    try {

        const { name, email, password, phoneNumber, branchRef, courseRef, joinedDate } = req?.body;
        const { id } = req.params;

        const { user } = req;

        const errors = [];

        if (email && !validateEmail(email)) {
            errors.push('Invalid email address');
        }

        if (name && !validateName(name)) {
            errors.push('Invalid name');
        }

        if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
            errors.push('Invalid phone number');
        }

        let hash;

        if (password) {

            // T--------
            if (password?.length < 8 || password?.length > 16) {
                throw createError(400, 'Invalid password. password must be between 8 and 16 characters.');
            }

            // T--------
            if (!validatePassword(password)) {
                throw createError(400, 'Invalid password. At least one lowercase letter,one uppercase letter,one digit,one special character,');
            }

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            hash = password ? bcrypt.hashSync(password, salt) : undefined;

        }

        if (errors.length > 0) {
            // There are validation errors, so throw an error with the list of errors
            throw createError(400, `Validation errors : ${errors}`);
        }

        const existingTrainer = await Trainer.findOne({ email });

        if (!existingTrainer) {


            if (user.isTrainer && user._id === req.params.id) {
                const updatedTrainer = await Trainer.findByIdAndUpdate(id, { $set: { password: hash } }, { new: true });
                res.status(200).json(updatedTrainer);
            } else if (user.isAdmin) {
                const updatedTrainer = await Trainer.findByIdAndUpdate(id, { $set: { email, password: hash, phoneNumber, name, courseRef, branchRef, joinedDate } }, { new: true });
                res.status(200).json(updatedTrainer);
            } else {
                throw createError(403, 'You are not authorized to update another trainer');
            }

        } else {
            throw createError(400, 'Email is already in use.');
        }
    } catch (error) {
        next(error);
    }


}
// -------------------------------------------------



// Delete Trainer
export const deleteTrainer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isStudent = await Student.find({ assignedTrainersRef: id });

        if (isStudent.length > 0) {
            res.status(400).json({ message: `Cannot delete trainer. ${isStudent.length} members are assigned to this trainer.`, success: false });
        } else {
            let isTrainer = await Trainer.findByIdAndDelete(id);

            if (!isTrainer) {
                res.status(400).json({ message: "Trainer is not found!.", success: false });
            } else {
                res.status(400).json({ message: "Trainer has been deleted.", success: false });
            }
        }
    } catch (error) {
        next(error);
    }
};


// Get Trainer
export const getTrainer = async (req, res, next) => {
    const { id } = req.params;

    try {

        if (req.user?.isTrainer && req.user?.id === id || req.user?.isAdmin) {
            // Check if the user is a trainer and the requested id matches their own
            const getTrainer = await Trainer.findById(id);
            const coursePromises = getTrainer?.courseRef.map(async (item) => {
                return await Course.findById(item._id)
            })

            const getTrainerWithCourses = await Promise.all(coursePromises);
            getTrainer.courseRef = getTrainerWithCourses

            res.status(200).json(getTrainer);

        } else {
            return next(createError(401, "You are not authenticated!"));
        }
    } catch (error) {
        next(error);
    }
};




// Get All Trainer
export const getTrainers = async (req, res, next) => {
    try {

        const page = parseInt(req.query?.page) || 1; // Get the page number from the query parameters, default to page 1
        const perPage = 100; // Number of documents to retrieve per page

        // Calculate the number of documents to skip based on the page number and perPage
        const skip = (page - 1) * perPage;


        const trainers = await Trainer.find()
        // .skip(skip).limit(perPage);
        res.status(200).json(trainers);

    } catch (error) {
        next(error);
    }
};






export const loginTrainer = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        if (!email || !req.body.password) {
            throw createError(400, 'Email and password are required.');
        }

        if (req.body.password.length < 8 || req.body.password.length > 50) {
            throw createError(400, 'Password must be between 8 and 50 characters.');
        }

        // Fetch the trainer by email
        const trainer = await Trainer.findOne({ email });

        if (!trainer) {
            throw createError(404, 'Trainer not found.');
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(req.body.password, trainer.password);

        if (!isPasswordValid) {
            throw createError(401, 'Incorrect email or password.');
        }

        // Create a JWT token
        const token = jwt.sign({ id: trainer._id, isTrainer: trainer.isTrainer }, process.env.JWT_SECRET);

        // Remove sensitive data from the response
        const { password, isTrainer, ...otherDetails } = trainer._doc;

        // Set the token as a cookie and send other details in the response
        res.status(200).json({ token, otherDetails })

    } catch (error) {
        next(error);
    }
}






// Get Trainer name by id
export const getTrainerNameById = async (req, res, next) => {

    const { id } = req.params;

    try {

        // Check if the user is a trainer and the requested id matches their own
        const getTrainer = await Trainer.findById(id);

        const { name } = getTrainer._doc

        res.status(200).json({ name });

    } catch (error) {
        next(error);
    }
};