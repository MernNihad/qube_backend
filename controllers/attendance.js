import Attendance from "../models/Attendance.js";
import { createError } from "../utils/error.js";
import Trainer from "../models/Trainer.js";
import Student from "../models/Student.js";
import { validateEmail, validateName } from "../utils/validations.js";
import mongoose from "mongoose";



// Create attendance ---> 
export const createAttendance = async (req, res, next) => {

    try {
        
        const {
            courseRef,
            trainerRef,
            studentRef,
            isPresent,
            isDate
        } = req.body

        console.log(req.body);

        if (!courseRef || !trainerRef || !studentRef || !isDate) {
            return next(createError(400, 'All fields are required.'));
        }


        const isDateToCOnvert = new Date(isDate);


        // Check if the attendance with the same name already exists
        const existingattendance = await Attendance.findOne({ courseRef, trainerRef, studentRef,
        
          isDate: {
            $gte: new Date(isDateToCOnvert.getFullYear(), isDateToCOnvert.getMonth(), isDateToCOnvert.getDate()),
            $lt: new Date(isDateToCOnvert.getFullYear(), isDateToCOnvert.getMonth(), isDateToCOnvert.getDate() + 1)
          }
        });

        if (existingattendance) {
            return next(createError(400, `already attendance marked on ${existingattendance.isDate} .`));
        }

        // Create a new attendance
        const newattendance = new Attendance({ courseRef, trainerRef, studentRef, isPresent, isDate });
        const savedattendance = await newattendance.save();

        res.status(201).json(savedattendance);
    } catch (error) {
        next(error);
    }

}
// ------------------------------------------------



// Get All attendances --->
export const getAttendances = async (req, res, next) => {


    
    
    try {

        const { id } = req.params


        let toConvertObj = new mongoose.Types.ObjectId(id) 
       

   

        
        const { year, month, date } = req.query; // Get year and month from query parameters
        const yearInt = parseInt(year);
        const monthInt = parseInt(month);
        const dateInt = parseInt(date);
      
        const startDate = new Date(yearInt, monthInt - 1, 1, 0, 0, 0, 0);
const endDate = new Date(yearInt, monthInt - 1, dateInt, 23, 59, 59, 999);

 const toObject = new mongoose.Types.ObjectId(req.user.id)

        const attendanceData = await Attendance.aggregate([

            {
              $match: {
                isDate: { $gte: startDate, $lte: endDate }, // Check date range directly
                studentRef: toObject, // Check studentRef for a match
                courseRef:toConvertObj,
              },
            },
          ]);


          // console.log(attendanceData,'ddddd');
          // return true

          if (attendanceData.length === 0) {
            return res.status(404).json({ message: 'No attendance data found for the specified date.' });
          }

        res.status(200).json(attendanceData);

    } catch (error) {
        next(error);
    }
}
// -------------------------------------------------



// Get All attendances count --->
export const getAttendancesCount = async (req, res, next) => {


  try {
    const { startDate, endDate } = req.query;

    const studentId = req.user.id;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const date = new Date('2023/12/31');
    console.log(date);

    let attendanceData ;

    if(startDate && endDate){

      
      
      // Parse the input date strings into Date objects
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      attendanceData = await Attendance.find({
        isDate: { $gte: startDateObj, $lte: endDateObj },
        studentRef: studentId,
      });

      
      // Find the student by ID to ensure it exists
    }else{

      attendanceData = await Attendance.find({
        
        studentRef: studentId,
      });

    }

    console.log(attendanceData,'--');
 

    // Fetch attendance data based on the date range and student ID
    // const attendanceData = await Attendance.countDocuments({
    //   isDate: { $gte: startDateObj, $lte: endDateObj },
    //   studentRef: studentId,
    // });

    // Fetch attendance data based on the date range and student ID
   
     // Initialize counts for attendance and absence
    let attendanceCount = 0;
    let absenceCount = 0;

    // Determine attendance and absence based on the value of isPresent
    attendanceData.forEach((record) => {
      if (record.isPresent) {
        attendanceCount++;
      } else {
        absenceCount++;
      }
    });

    res.status(200).json({
      result: {
        attendanceCount,
        absenceCount,
      },
      success: true,
    });

  } catch (error) {
    next(error);
  }
}
// -------------------------------------------------

