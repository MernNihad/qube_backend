import mongoose, { Schema, model } from "mongoose";

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        match: /^\d{10}$/, // Use a regular expression to enforce 10 digits,
        required: true
    },
    branchRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },
    courses: [
        {
            assignedCourseRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
            assignedTrainersRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Trainer',
            },
            isCompleted: {
                type: Boolean,
                default: false,
            },
            dateAssigned: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isStudent: {
        type: Boolean,
        default: true,
    },
    github: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
    joinedDate: {
        type: Date,
    }
}, { timestamps: true });

const Student = model("Student", StudentSchema);

export default Student;
