import mongoose from "mongoose";
import Course from "../models/Course.js";
import { createError } from "../utils/error.js";
import Student from "../models/Student.js";
import { validateName } from "../utils/validations.js";



// Create Course
export const createSubCourse = async (req, res, next) => {

    try {

        const { id } = req?.params

        // * - name
        const { name, details, syllabus } = req?.body;

        // T--------
        if (!name) {
            throw createError(400, 'Invalid name.');
        }

        // T--------
        if (name?.length < 3 || name?.length > 50) {
            throw createError(400, 'Invalid name. Name must be between 3 and 50 characters.');
        }

        // T--------
        if (!validateName(name)) {
            throw createError(400, 'Invalid name.');
        }

        const existingCourse = await Course.findOne({ name });

        if (existingCourse) {
            throw createError(400, 'Name is already in use.');
        }

        const newCourse = new Course({ name, details, syllabus, isMainCourse: false });
        const savedCourse = await newCourse.save();

        try {
            // Find the main course by its _id and push the sub-course's _id to the subCourses array
            await Course.findByIdAndUpdate(id, {
                $push: { subCourses: savedCourse?._id },
            });

            res.status(200).json(savedCourse);

        } catch (error) {

            next(error)
        }

        res.status(201).send(savedCourse);
    } catch (error) {

        next(error);
    }
}
// ------------------------------------------------
// T-----------------------------------



// Delete SubCourse
export const deleteSubCourse = async (req, res, next) => {

    const { id, subcourse } = req?.params

    try {

        const subCourseObjectId = new mongoose.Types.ObjectId(subcourse);
        let result = await Student.find({
            courses: {
                $elemMatch: {
                    assignedCourseRef: subCourseObjectId
                }
            }
        });

        if (!(result?.length > 0)) {

            try {

                const updatedCourse = await Course.findByIdAndUpdate(id, { $pull: { subCourses: subCourseObjectId } });

                if (updatedCourse) {

                    await Course.findByIdAndDelete(subcourse);

                    res.status(200).json({ message: "Course has been deleted.", success: false });
                }
            } catch (error) {

                next(error);

            }

        } else {

            res.status(200).json({ message: "Members avaible in this course!", count: result.length, success: false });

        }

    } catch (error) {

        next(error)

    }
}
// -----------------------------------------------


