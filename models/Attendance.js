import mongoose, { Schema, model } from "mongoose";


const AttendanceSchema = new Schema({
    isPresent: {
        type: Boolean,
        required: true,
    },
    isDate: {
        type: Date,
        required: true,
    },
    studentRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required:true
    },
    trainerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required:true
    },
    courseRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required:true
    },
},
    { timestamps: true }
)

const Attendance = model("Attendance", AttendanceSchema);

export default Attendance;