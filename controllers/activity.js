import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { validateEmail, validateName, validatePassword, validatePhoneNumber } from "../utils/validations.js";
import Activity from "../models/Activity.js";
import User from "../models/Admin.js";
import Trainer from "../models/Trainer.js";
import Course from "../models/Course.js";
import Answer from "../models/Answer.js";




export const createActivity = async (req, res, next) => {

    try {

        const { type, topic, notes, duedate, mark, attachment, studentsRef, trainersRef, courseRef } = req.body

        if (!type) return next(createError(400, 'type is required.'));
        if (!topic) return next(createError(400, 'topic is required.'));
        if (!duedate) return next(createError(400, 'duedate is required.'));
        if (!studentsRef) return next(createError(400, 'studentsRef is required.'));
        if (!trainersRef) return next(createError(400, 'trainersRef is required.'));
        if (!courseRef) return next(createError(400, 'courseRef is required.'));


        // T--------
        if (topic?.length < 3 || topic?.length > 250) {
            throw createError(400, 'Invalid tpoics. topics must be between 3 and 250 characters.');
        }

        // T--------
        if (mark > 100) {
            throw createError(400, 'Invalid score. no more than 100 characters.');
        }

        const newActivity = new Activity({ type, topic, notes, duedate, mark, attachment, trainersRef, studentsRef, courseRef })

        const savedActivity = await newActivity.save();

        res.status(200).json(savedActivity);

    } catch (error) {

        next(error)

    }
}



// -----------------------------------------------



// Get Student
export const getActivity = async (req, res, next) => {

  

    const { id } = req.user

    try {
        if (req.user.isAdmin) {

            const AllACtivities = await Activity.find();
            res.status(200).json({ result: AllACtivities, success: true });

        }



        if (req.user.isStudent) {

            const allActivities = await Activity.find({ studentsRef: id });


            if (!(allActivities.length > 0) ) {
                return next(createError(404, 'Activity not found.'));
            }

            const activitiesResponse = await Promise.all(
                allActivities.map(async (activity) => {
                    const { ...others } = activity._doc
                    
                    const trainer = await Trainer.findById(activity.trainersRef);
                    // Fetch the course information
                    const courses = await Course.findById(activity.courseRef);

                    const isAnswered = await Answer.findOne({ activityRef: activity._id, studentRef: req.user.id });

                    const response = {
                        _id: activity._id,
                        type: activity.type,
                        topic: activity.topic,
                        notes: activity.notes,
                        duedate: activity.duedate,
                        mark: activity.mark,
                        trainersRef: activity.trainersRef,
                        trainersName: trainer?.name, // Get trainer name
                        courseRef: courses,
                        createdAt: activity.createdAt,
                        updatedAt: activity.updatedAt,
                        __v: activity.__v,
                    };

                    if (isAnswered) {
                        response.answer = isAnswered
                    }      
                    return response;

                })
            );

            res.status(200).json({ result: activitiesResponse, success: true });
        }






        if (req.user.isTrainer) {
            const allActivities = await Activity.find({ trainersRef: id });

            if (!(allActivities.length > 0) ) {
                return next(createError(404, 'Activity not found.'));
            }
    
            const activitiesResponse = await Promise.all(
                allActivities.map(async (activity) => {
                    // Fetch students' details
                    const studentsDetails = await Student.find({ _id: { $in: activity.studentsRef } });

           

                const res = await Promise.all(studentsDetails.map(async(item)=>{
                    const isAnswerMatch = await Answer.findOne({ activityRef: activity._id }) ;
                    // console.log(isAnswerMatch,'----');
                    // item.answer = isAnswerMatch
                    return {...item._doc,answer:isAnswerMatch};
                }))

             

                    const courses = await Course.findOne({ _id: { $in: activity.courseRef } });

                    // Fetch answers matching the activity
                    const answers = await Answer.find({ activityRef: activity._id });

                    const response = {
                        _id: activity._id,
                        type: activity.type,
                        status: activity.status,
                        topic: activity.topic,
                        notes: activity.notes,
                        duedate: activity.duedate,
                        mark: activity.mark,
                        studentsRef: res,
                        trainersRef: activity.trainersRef,
                        courseRef: courses,
                        
                        // answer: res,
                        createdAt: activity.createdAt,
                        updatedAt: activity.updatedAt,
                        __v: activity.__v,
                    };

                    return response;
                })
            );

            res.status(200).json({ result: activitiesResponse, success: true });
        }

    } catch (error) {

        next(error)

    }
}
// -------------------------------------------




export const createAnswer = async (req, res, next) => {

    const { activityRef, attachment } = req.body;
    const studentId = req.user.id; // Assuming you have user information in the request object




    try {
        // Validate input
        if (!activityRef) {
            return next(createError(400, 'activityRef is required.'));
        }

        if (!attachment) {
            return next(createError(400, 'attachment is required.'));
        }



        // Check if the activity exists
        const activity = await Activity.findById(activityRef);
        // console.log(activity);
        // return true
        if (!activity) {
            return next(createError(404, 'Activity not found.'));
        }

        // Check if the user is a student
        if (!req.user.isStudent) {
            return next(createError(403, 'Only students are allowed to submit answers for this activity.'));
        }

        const isActivity = await Answer.find({ activityRef: activityRef, studentRef: studentId });

        //         const isA = await Answer.find();
        // console.log(!(isActivity.length === 0) );
        // return true

        // // Ensure the student is allowed to submit answers to this activity
        if (!(isActivity.length === 0)) {
            return next(createError(403, 'You have aleady submited'));
        }



        // return true
        // Check if the student has already submitted an answer for this activity
        // if (activity.answer.some((ans) => ans.studentRef?.toString() === studentId)) {
        //     return next(createError(400, 'You have already submitted an answer for this activity.'));
        // }
        const newAnswer = new Answer({ attachment, studentRef: studentId, activityRef })

        // // Create a new answer
        // const answer = {
        //     studentRef: studentId,
        //     attachment: attachment,
        //     status: 'submitted', // You can set the initial status here
        //     mark: 0, // You can set the initial mark here
        // };

        // Add the answer to the activity's answer array
        // activity.answer.push(answer);

        const savedActivity = await newAnswer.save();


        // Save the updated activity document
        // const savedActivity = await activity.save();

        res.status(200).json(savedActivity);
    } catch (error) {
        next(error);
    }

}




export const evaluationAnswer = async (req, res, next) => {

    const { answerRef,remark,mark } = req.body;
    const studentId = req.user.id; // Assuming you have user information in the request object



    try {
        // Validate input
        if (!answerRef) {
            return next(createError(400, 'answerRef is required.'));
        }

        if (!mark) {
            return next(createError(400, 'score is required.'));
        }



        // Check````` if the answer exists
        // const updatedBranch = await Answer.findByIdAndUpdate(id, { name }, { new: true });
        // const answer = await Answer.findByIdAndUpdate(answerRef);

        const answer = await Answer.findByIdAndUpdate(answerRef, { $set:{ remark, mark , status:"evaluated"} },{ new: true });
    
        if (!answer) {
            return next(createError(404, ' Answer not found.'));
        }
      
        res.status(200).json(answer);
    } catch (error) {
        next(error);
    }

}
