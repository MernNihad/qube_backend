import mongoose, { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    }, // Notification creator
    receiver: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trainer'
        }
    ], // Ids of the receivers of the notification
    message: {
        type: String,
        required:true,
    }, // any description of the notification message 
    date: {
        type: Date,
        default: Date.now
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    }, // Reference to the branch
    everyone: {
        type: Boolean,
        default: false
    },


});



const Notification = model("notification", notificationSchema);

export default Notification;



// const notificationSchema = new Schema({
//     topic: {
//         type: String,
//         required: true,
//     },
//     branchRef: [

//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Branch",
//         }
//     ],
//     studentRef: [

//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Student",
//         }
//     ],
//     trainerRef: [

//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Trainer",
//         }
//     ],
// }, { timestamps: true });
