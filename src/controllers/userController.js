const userService = require("../services/userService");

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers(req.query.search);
        res.json(users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

const createOrUpdateUser = async (req, res) => {
    try {
        const result = await userService.createOrUpdateUser(req.body);
        res.status(200).json({
            success: true,
            message: result.message,
            data: result.user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

const makeAdmin = async (req, res) => {
    try {
        const result = await userService.makeAdmin(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const result = await userService.forgetPassword(email);
        if (typeof result === "string") {
            return res.status(404).json({
                success: false,
                message: result,
            });
        }
        res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await userService.verifyOtp(email, otp);
        if (result.status === 404 || result.status === 410) {
            return res
                .status(result.status)
                .json({ success: false, message: result.message });
        }
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const result = await userService.resetPassword(email, newPassword);
        res.status(result.status).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

module.exports = {
    getUsers,
    createOrUpdateUser,
    makeAdmin,
    forgetPassword,
    verifyOtp,
    resetPassword,
};
