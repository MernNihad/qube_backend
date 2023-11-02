import Branch from "../models/Branch.js";
import { createError } from "../utils/error.js";
import Trainer from "../models/Trainer.js";
import Student from "../models/Student.js";
import { validateEmail, validateName } from "../utils/validations.js";
import Course from "../models/Course.js";



// get subcourse count ---> 
export const subcoursecount = async (req, res, next) => {

    try {

        const getSubcourseCount = await Course.countDocuments({ isMainCourse: false })



        res.status(200).json({ result: getSubcourseCount, success: true });
    } catch (error) {
        next(error);
    }

}
// ------------------------------------------------




// get trainers count
export const trainerscount = async (req, res, next) => {

    try {

        const getTrainerscount = await Trainer.countDocuments()



        res.status(200).json({ result: getTrainerscount, success: true });
    } catch (error) {
        next(error);
    }



}
// -------------------------------------------------


// get students count
export const studentscount = async (req, res, next) => {

    try {

        const getstudentscount = await Student.countDocuments()



        res.status(200).json({ result: getstudentscount, success: true });
    } catch (error) {
        next(error);
    }



}
// -------------------------------------------------




// get students count
export const piecoursecount = async (req, res, next) => {

    try {
        const getCoursePieGraph = await Course.find({ isMainCourse: true });
      
        const result = await Promise.all(
          getCoursePieGraph.map(async (mainCourse) => {
            const courseCounts = await Promise.all(
              mainCourse.subCourses.map(async (subCourse) => {
                // Find students who are assigned to this subcourse
                const studentCount = await Student.countDocuments({
                  'courses.assignedCourseRef': subCourse,
                });
                return studentCount;
              })
            );
      
            // Calculate the total number of students for this main course
            const totalStudents = courseCounts.reduce((acc, count) => acc + count, 0);
      
            return {
              courseName: mainCourse.name,
              count: totalStudents,
            };
          })
        );
      
        // Organize the results by main course name
        const groupedResults = result.reduce((acc, item) => {
          const existing = acc.find((group) => group.courseName === item.courseName);
          if (existing) {
            existing.count.push(item.count);
          } else {
            acc.push({
              courseName: item.courseName,
              count: [item.count],
            });
          }
          return acc;
        }, []);
      
        res.status(200).json({ result: groupedResults, success: true });
      } catch (error) {
        next(error);
      }
      


}
// -------------------------------------------------





// Get All Branchs --->
export const getBranchs = async (req, res, next) => {

    try {

        // const page = parseInt(req.query?.page) || 1; // Get the page number from the query parameters, default to page 1
        // const perPage = 100; // Number of documents to retrieve per page

        // Calculate the number of documents to skip based on the page number and perPage
        // const skip = (page - 1) * perPage;
        const branches = await Branch.find()
        // .skip(skip).limit(perPage);

        if (branches.length === 0) {
            return res.status(404).json({ message: 'No branches found.' });
        }

        res.status(200).json({ result: branches, success: true });

    } catch (error) {
        next(error);
    }
}
// -------------------------------------------------