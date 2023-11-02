import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { validateEmail, validateName, validatePassword, validatePhoneNumber } from "../utils/validations.js";
import Course from "../models/Course.js";
import Trainer from "../models/Trainer.js";
import Branch from "../models/Branch.js";




export const registerStudent = async (req, res, next) => {

    try {

        const { name, email, password, phoneNumber, branchRef, courses, github, linkedin, status } = req.body; // excluse task,

        // T--------


        if (!name || !email || !phoneNumber || !branchRef || !courses.length > 0 || !password) {
            return next(createError(400, 'All fields are required.'));
        }

        // T--------
        if (name?.length < 3 || name?.length > 50) {
            throw createError(400, 'Invalid name. Name must be between 3 and 50 characters.');
        }

        // T--------
        if (password?.length < 8 || password?.length > 16) {
            throw createError(400, 'Invalid password. password must be between 8 and 16 characters.');
        }

        // T--------
        if (!validatePassword(password)) {
            throw createError(400, 'Invalid password. At least one lowercase letter,one uppercase letter,one digit,one special character,');
        }

        // T--------
        if (!validateName(name)) {
            throw createError(400, 'Invalid name.');
        }

        // T--------
        if (!validateEmail(email)) {
            throw createError(400, 'Invalid mail.');
        }

        // T--------
        if (!validatePhoneNumber(phoneNumber)) {
            throw createError(400, 'Invalid mobile number.');
        }

        const existingStudent = await Student.findOne({ email })

        if (!(existingStudent)) {

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.body?.password, salt);

            const newStudent = new Student({ name, email, password: hash, phoneNumber, branchRef, courses: courses, github, linkedin, status })
            const savedStudent = await newStudent.save();

            const { password, ...otherDetails } = savedStudent._doc;

            res.status(200).json(otherDetails);

        } else {
            return next(createError(400, 'Email is already in use.'));
        }

    } catch (error) {
        next(error)
    }



}



// Update Student
export const updateStudent = async (req, res, next) => {

    try {
        const { name, email, password, phoneNumber, branchRef, courses, github, linkedin, status } = req?.body;
        const { id } = req?.params;

        if (name) {
            if (validateName(name)) {
                if (name?.length < 3 || name?.length > 50) {
                    throw createError(400, 'Name must be between 3 and 50 characters.');
                }
            } else {
                throw createError(400, 'Invalid name.');
            }
        }

        if (email) {
            // T--------
            if (!validateEmail(email)) {
                throw createError(400, 'Invalid mail.');
            }
        }

        if (phoneNumber) {
            // T--------
            if (!validatePhoneNumber(phoneNumber)) {
                throw createError(400, 'Invalid mobile number.');
            }
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
            hash = bcrypt.hashSync(password, salt);
        }

        const existingStudent = await Student.findOne({ email });

        if (!(existingStudent)) {

            if (req?.user?.isAdmin) {
                const updatedStudent = await Student.findByIdAndUpdate(id, { $set: { email, password: hash, phoneNumber, branchRef, name, courses, github, linkedin, status } }, { new: true });
                res.status(200).json({ result: updatedStudent, success: true });

            } else if (req?.user?.isStudent) {

                const updatedStudent = await Student.findByIdAndUpdate(id, { $set: { password: hash, github, linkedin } }, { new: true });
                res.status(200).json({ result: updatedStudent, success: true });

            } else {

                return next(createError(403, "You are not authorized!"));

            }

        } else {
            throw createError(400, 'Email is already in use.');

        }

    } catch (error) {
        next(error)
    }
}
// -------------------------------------------------





// Delete Student
export const deleteStudent = async (req, res, next) => {

    const { id } = req.params

    try {
        await Student.findByIdAndDelete(id);
        res.status(200).json({ message: "Student has been deleted.", success: true });
    } catch (error) {
        next(error)
    }
}
// -----------------------------------------------



// Get Student
export const getStudent = async (req, res, next) => {

    const { id } = req.params

    try {

        const getStudent = await Student.findById(id);

        if (!getStudent) {
            return next(createError(404, 'student not found.'));
        }

        const waitForGetCourses = getStudent?.courses?.map(async (item) => {
            const { assignedTrainersRef, isCompleted, dateAssigned } = item
            let response = await Course.findById(item?.assignedCourseRef)
            let responseForTrainer = await Trainer.findById(item?.assignedTrainersRef)

            if (!response) {
                throw createError(400, 'Course is not avaible.');
            }
            if (!responseForTrainer) {
                throw createError(400, 'Trainer is not avaible.');
            }
            let newArray = { ...response._doc }
            newArray.assignedTrainersRef = assignedTrainersRef;
            newArray.isCompleted = isCompleted;
            newArray.dateAssigned = dateAssigned;
            newArray.trainerName = responseForTrainer.name
            return newArray

        })



        const { password, courses, ...newObj } = getStudent?._doc;

        const responseForBranch = await Branch.findById(getStudent.branchRef)

        newObj.branchName = responseForBranch.name
        newObj.courses = await Promise.all(waitForGetCourses)

        res.status(200).json(newObj);

    } catch (error) {

        next(error)

    }
}
// -------------------------------------------





// Get All Student
export const getStudents = async (req, res, next) => {

    try {
        const isStudentStatus = req.query?.status === 'true' || false; // Convert the query parameter to a boolean, default to false if not provided

        // const page = parseInt(req.query?.page) || 1; // Get the page number from the query parameters, default to page 1
        // const perPage = 100; // Number of documents to retrieve per page

        // Calculate the number of documents to skip based on the page number and perPage
        // const skip = (page - 1/) * perPage;

        const Students = await Student.find({ status: isStudentStatus })
        // .skip(skip).limit(perPage);

        if (Students.length > 0) {
            let finalResult = Students?.map(async (item) => {

                const { courses, ...otherDetails } = item._doc

                let reusltOfCourse = courses?.map(async (course) => {
                    const { assignedCourseRef, _id, ...otherCourseDetails } = course?._doc
                    let responseForCourse = await Course.findById(assignedCourseRef)
                    let responseForTrainer = await Trainer.findById(course.assignedTrainersRef)

                    if (responseForCourse) {
                        const { ...details } = responseForCourse?._doc
                        const newArr = { ...otherCourseDetails, ...details }
                        newArr.trainerName = responseForTrainer?.name
                        return newArr
                    }

                })

                let getResultOfCourse = await Promise.all(reusltOfCourse)
                const getBranch = await Branch.findById(otherDetails.branchRef)

                otherDetails.branchName = getBranch.name;
                otherDetails.courses = getResultOfCourse



                return otherDetails

            })

            let responseForfinalResult = await Promise.all(finalResult)

            console.log(responseForfinalResult, 'ss ');
            res.status(200).json(responseForfinalResult);
        }


        if (Students.length === 0) {
            return res.status(404).json({ message: 'No students found.' });
        }



    } catch (error) {

        next(error);

    }
}
// -------------------------------------------------






export const loginStudent = async (req, res, next) => {

    const { email, password } = req.body;

    try {

        const student = await Student.findOne({ email: email });

        if (!student) return next(createError(404, "Student is not founded!"))

        const isPassword = await bcrypt.compare(req.body.password, student.password)

        if (!isPassword) return next(createError(400, "Wrong username or password!"))

        const { password, isStudent, ...otherDetails } = student._doc;

        const token = jwt.sign({ id: student._id, isStudent: student.isStudent }, process.env.JWT_SECRET)

        res.status(200).json({ token, otherDetails })

    } catch (error) {

        next(error)

    }
}





// Get All Student
export const getAllStudents = async (req, res, next) => {

    try {
        const { id } = req.params

        const isStudentStatus = req.query?.status === 'true' || false; // Convert the query parameter to a boolean, default to false if not provided

        // const page = parseInt(req.query?.page) || 1; // Get the page number from the query parameters, default to page 1
        // const perPage = 100; // Number of documents to retrieve per page

        // Calculate the number of documents to skip based on the page number and perPage
        // const skip = (page - 1) * perPage;
        const Students = await Student.find({ assignedTrainersRef: id, status: isStudentStatus })
        // .skip(skip).limit(perPage);

        res.status(200).json(Students);

    } catch (error) {

        next(error);

    }
}
// -------------------------------------------------


// Get getAllStudentsByTrainer
export const getAllStudentsByTrainer = async (req, res, next) => {
    try {
        const { courseid, trainerid } = req.params;

        // Convert the query parameter to a boolean, default to false if not provided
        // const isStudentStatus = req.query?.status === 'true' || false;
        const page = parseInt(req.query?.page) || 1; // Get the page number from the query parameters, default to page 1
        const perPage = 100; // Number of documents to retrieve per page

        let matchingQuery;

        if (courseid && trainerid) {
            matchingQuery = {
                $elemMatch: {
                    'assignedTrainersRef': trainerid,
                    'assignedCourseRef': courseid,
                },
            };
        } else if (trainerid) {
            matchingQuery = {
                $elemMatch: {
                    'assignedTrainersRef': trainerid,
                },
            };
        }

        // Calculate the number of documents to skip based on the page number and perPage
        const skip = (page - 1) * perPage;

        // Use Mongoose's `populate` to fetch course details for each student's assigned course
        const Students = await Student.find({ 'courses': matchingQuery })
            .populate({
                path: 'courses.assignedCourseRef',
                model: 'Course', // Use the model name for the course collection
            });

        res.status(200).json(Students);
    } catch (error) {
        next(error);
    }

}
// -------------------------------------------------
