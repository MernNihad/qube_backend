import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Trainer from "../models/Trainer.js";
import { createError } from "../utils/error.js";
import { validateName } from "../utils/validations.js";




// Create Course
export const createCourse = async (req, res, next) => {

    try {
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

        let newCourse = new Course({ name, details, syllabus });

        const savedCourse = await newCourse.save();

        res.status(201).send(savedCourse);

    } catch (error) {

        next(error);

    }

}
// ------------------------------------------------
// T-----------------------------------



// Update Course
export const updateCourse = async (req, res, next) => {

    try {

        const { id } = req?.params

        const { name, details, syllabus } = req?.body;

        if (name) {
            if (validateName(name)) {
                if (name?.length < 3 || name?.length > 50) {
                    throw createError(400, 'Name must be between 3 and 50 characters.');
                }
            } else {
                throw createError(400, 'Invalid name.');
            }
        }


        const existingCourse = await Course.findOne({ name });


        if (existingCourse) {
            throw createError(400, 'Name is already in use.');
        }


        const newCourse = await Course.findByIdAndUpdate(id, { $set: { name, details, syllabus } }, { new: true });
        res.status(200).json(newCourse);

    } catch (error) {

        next(error);

    }


}
// -------------------------------------------------
// T-----------------------------------



// Delete Course
export const deleteCourse = async (req, res, next) => {

    const { id } = req?.params

    try {
        const getCourse = await Course.findById(id);

        if (!getCourse) {
            return next(createError(404, 'Course not found.'));
        }

        const subCourses = getCourse.subCourses || []; // Ensure subCourses is an array or initialize as an empty array if undefined

        const counts = await Promise.all(subCourses.map(async (item) => {
            return await Student.countDocuments({ courseRef: item })
        }))


        const totalCount = counts.reduce((acc, count) => acc + count, 0);

        console.log(totalCount)

        if (totalCount === 0) {
            try {

                const Trainers = await Trainer.find({ courseRef: id })

                await Course.findByIdAndDelete(id);
                res.status(200).json({ message: "Course has been deleted." ,success:true});
            } catch (error) {
                next(error)

            }
        } else {
            res.status(200).json({ message: "Studetns has already availbe.",success:false });
        }

    } catch (error) {

    }


}
// -----------------------------------------------



// Get Course
export const getCourse = async (req, res, next) => {

    const { id } = req?.params

    try {

        const getCourse = await Course.findById(id);

        if(getCourse?.subCourses?.length >0){

            const isSubcoursesList = await Promise.all(getCourse?.subCourses?.map(async (item) => {
                return await Course.findById(item)
            }))
            getCourse.subCourses = isSubcoursesList
            res.status(200).json(getCourse);
        }else{
            res.status(200).json(getCourse);
        }

    } catch (error) {

        next(error)

    }
}
// -------------------------------------------





// Get Courses
export const getCourses = async (req, res, next) => {

    const isMainCourse = req.query?.ismaincourse === 'true' || false; // Convert the query parameter to a boolean, default to false if not provided

    // const page = parseInt(req.query?.page) || 1; // Get the page number from the query parameters, default to page 1
    // const perPage = 100; // Number of documents to retrieve per page

    try {

        // Calculate the number of documents to skip based on the page number and perPage
        // const skip = (page - 1) * perPage;

        // Query the database with skip and limit options
        const Courses = await Course.find({ isMainCourse })
        // .skip(skip).limit(perPage);
        

        res.status(200).json({result:Courses,success:true});

    } catch (error) {

        next(error);

    }
}
// -------------------------------------------------
// T-----------------------------------
