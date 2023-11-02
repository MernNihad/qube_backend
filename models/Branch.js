import { Schema, model } from "mongoose";


const BranchSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
},
    { timestamps: true }
)

const Branch = model("Branch", BranchSchema);

export default Branch;