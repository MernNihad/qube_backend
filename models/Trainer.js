import mongoose, { Schema, model } from "mongoose";

const TrainerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: 1,
    },

    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        match: /^\d{10}$/, // Use a regular expression to enforce 10 digits
        required: true
    },
    branchRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },
    courseRef: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    isTrainer: {
        type: Boolean,
        default: true,
    },
    joinedDate: {
        type: Date,
    },
    linkedin:{
        type:String
    },
    github:{
        type:String
    },
    profilePic:{
        type:String
    }
}, { timestamps: true });

const Trainer = model("Trainer", TrainerSchema);

export default Trainer;
