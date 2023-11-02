import User from "../models/User.js";






// Update User
export const updateUser = async (req, res, next) => {

    const { id } = req.params

    const { username,email,password } = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate( id, { $set: { username,email,password } }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error)
    }
}
// -------------------------------------------------



// Delete User
export const deleteUser = async (req, res, next) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User has been deleted." });
    } catch (error) {
        next(error)
    }
}
// -----------------------------------------------



// Get User
export const getUser = async (req, res, next) => {
    const { id } = req.params
    try {
        const getUser = await User.findById(id);
        res.status(200).json(getUser);
    } catch (error) {
        next(error)
    }
}
// -------------------------------------------





// Get All Users
export const getUsers = async (req, res, next) => {
    try {
        const Users = await User.find();
        res.status(200).json(Users);
    } catch (error) {
        next(error);
    }
}
// -------------------------------------------------