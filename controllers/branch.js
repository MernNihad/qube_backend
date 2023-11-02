import Branch from "../models/Branch.js";
import { createError } from "../utils/error.js";
import Trainer from "../models/Trainer.js";
import Student from "../models/Student.js";
import { validateEmail, validateName } from "../utils/validations.js";



// Create Branch ---> 
export const createBranch = async (req, res, next) => {

    const { name } = req.body;

    try {
        // Validate name
        if (!name || !validateName(name) || name.length < 3 || name.length > 50) {
            throw createError(400, 'Invalid name. Name must be between 3 and 50 characters.');
        }

        // Check if the branch with the same name already exists
        const existingBranch = await Branch.findOne({ name });

        if (existingBranch) {
            throw createError(400, 'Name is available.');
        }

        // Create a new branch
        const newBranch = new Branch({ name });
        const savedBranch = await newBranch.save();

        res.status(201).json({result:savedBranch,success:true});
    } catch (error) {
        next(error);
    }

}
// ------------------------------------------------




// Update Branch
export const updateBranch = async (req, res, next) => {

    const { id } = req.params;
    const { name } = req.body;

    if (name) {
        // Validate name
        if (!validateName(name)) {
            return next(createError(400, 'Invalid name'));
        }

        if (name.length < 3 || name.length > 50) {
            return next(createError(400, 'Name must be between 3 and 50 characters.'));
        }
    }

    try {
        // Check if a branch with the new name already exists
        const existingBranch = await Branch.findOne({ name });

        if (existingBranch) {
            return next(createError(200, 'Name is available.'));
        }

        // Update the branch by ID
        const updatedBranch = await Branch.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedBranch) {
            return next(createError(404, 'Branch not found.'));
        }

        res.status(200).json(updatedBranch);
    } catch (error) {
        next(error);
    }


}
// -------------------------------------------------



// Delete Branch
export const deleteBranch = async (req, res, next) => {

    const { id } = req.params;

    try {
        const isTrainer = await Trainer.find({ branchRef: id });
        const isStudent = await Student.find({ branchRef: id });

        if (isTrainer.length > 0 || isStudent.length > 0) {
            return res.status(400).json({ message: "Members available in this branch!", trainerCount: isTrainer?.length, studentCount: isStudent?.length,success:false });
        }

        await Branch.findByIdAndDelete(id);
        res.status(200).json({ message: "Branch has been deleted.",success:true });
    } catch (error) {
        next(error);
    }
}
// -----------------------------------------------



// Get Branch
export const getBranch = async (req, res, next) => {
    const { id } = req.params;

    try {
        const branch = await Branch.findById(id);

        if (!branch) {
            return next(createError(404, 'Branch not found.'));
        }

        res.status(200).json(branch);
    } catch (error) {
        next(error);
    }
}
// -------------------------------------------





// Get All Branchs --->
export const getBranchs = async (req, res, next) => {
    
    try {
        
        // const page = parseInt(req.query?.page) || 1; // Get the page number from the query parameters, default to page 1
        // const perPage = 100; // Number of documents to retrieve per page
        
        // Calculate the number of documents to skip based on the page number and perPage
        // const skip = (page - 1) * perPage;
        const branches = await Branch.find()
        // .skip(skip).limit(perPage);

        if (branches.length === 0) {
            return res.status(404).json({ message: 'No branches found.' });
        }

        res.status(200).json({result:branches,success:true});

    } catch (error) {
        next(error);
    }
}
// -------------------------------------------------