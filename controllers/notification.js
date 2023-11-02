import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";


export const createNotification = async (req, res, next) => {


    try {
        const { sender, receiver, message, branch, everyone } = req.body;

        // return true

        if (!sender || !message) {
            throw createError(400, 'fields required.');
        }


        const newNotification = new Notification({ sender, receiver, message, branch, everyone });
        console.log(newNotification)

        const savedNotification = await newNotification.save();

        // const { password: _, ...otherDetails } = savedNotification?._doc;
        res.status(200).json(savedNotification);

    } catch (error) {
        next(error);
    }

}

// Delete Notification
export const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);


            res.status(200).json({ message: "Notification has been deleted." });
       
    } catch (error) {
        next(error);
    }
};


// Get All Notification
export const getNotifications = async (req, res, next) => {

    try {

        // const page = parseInt(req?.query?.page) || 1; // Get the page number from the query parameters, default to page 1
        // const perPage = 100; // Number of documents to retrieve per page

        // Calculate the number of documents to skip based on the page number and perPage
        // const skip = (page - 1) * perPage;

        if (req?.user?.isStudent || req.user.isTrainer) {

            const { id, isStudent } = req?.user

            const Notifications = await Notification.find({
                $or: [
                    { everyone: true },     // Condition 1: Check if everyone is true
                    { receiver: id }        // Condition 2: Check if receiver matches the provided id
                ]
            }
            )
            // .skip(skip).limit(perPage);

            res.status(200).json(Notifications);
        } else if (req.user.isAdmin) {

            const { id, isAdmin } = req?.user

            const Notifications = await Notification.find()
            // .skip(skip).limit(perPage);

            res.status(200).json(Notifications);
        }
        else {

            return next(createError(401, "Your are not authenticated!"))

        }
    } catch (error) {
        next(error);
    }
};
