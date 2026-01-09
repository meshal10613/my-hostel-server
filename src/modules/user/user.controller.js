import { userService } from "./user.service.js";

const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: result.message,
            totalUsers: result.users.length,
            data: result.users,
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userService.getUserById(id);
        res.status(200).json({
            success: true,
            message: result.message,
            data: result.user,
        });
    } catch (error) {
        next(error);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(200).json({
            success: true,
            message: result?.message || "",
            user: result?.user || "",
            token: result?.token || "",
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: result?.message || "",
            user: result?.user || "",
            token: result?.token || "",
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUserById(id);
        res.status(200).json({
            success: true,
            message: result?.message || "",
            userId: result.userId,
        });
    } catch (error) {
        next(error);
    }
};

const updateUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await userService.updateUserById(id, updateData);
        res.status(200).json({
            success: true,
            message: result?.message || "",
            user: result?.user || {},
        });
    } catch (error) {
        next(error);
    }
};

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await userService.forgetPassword(email);
        res.status(200).json({
            success: true,
            message: result?.message || "",
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    deleteUserById,
    updateUserById,
    forgetPassword,
};
