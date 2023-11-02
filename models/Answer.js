import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({

    studentRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    status: {
        type: String,
        enum: ["submitted", "evaluated"], // Corrected typo in "submitted"
        default:"submitted"
    },
    mark: {
        type: Number,
        default: 0
    },
    attachment: {
        type: String,
    },
    remark: {
        type: String,
    },
    activityRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity"
    },


}, { timestamps: true });

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
