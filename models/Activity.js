import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["presentation", "test", "task"], // Allow only these three values
        required: true,
    },
    status: {
        type: String,
        default: "assigned", // Updated to a string
    },

    topic: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    duedate: {
        type: Date, // Activity due date
        required: true,
    },
    mark: {
        type: Number,
        default: 0
    },
    attachment: {
        type: String,
    },
    studentsRef: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }
    ],
    trainersRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer"
    },
    courseRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
    ,
}, { timestamps: true });

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
