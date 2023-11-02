import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        unique: true,
    },

    details: {
        type: String,
    },
    isMainCourse: {
        type: Boolean,
        default: true,
    },
    subCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    syllabus:{
        type:String
    }
},{ timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
