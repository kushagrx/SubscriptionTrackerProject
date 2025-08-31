import User from "../models/user.model.js";

export const getUsers = async (req, res,next) => {
    try {
        const users = await User.find();
        res.status(200).json({success: true, data: users});
    }
    catch (error) {
        next(error);
    }
}

export const getUser = async (req, res,next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');  //all fields but the password

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({success: true, data: user});
    }
    catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        console.log(`Attempting to delete user with ID: ${req.params.id}`);
        
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        
        console.log(`Successfully deleted user: ${user.name} (${user.email})`);
        res.status(200).json({
            success: true, 
            message: 'User deleted successfully',
            data: { id: user._id, name: user.name, email: user.email }
        });
    }
    catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        next(error);
    }
}