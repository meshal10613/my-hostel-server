import User from "./user.model.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";
import { generateOtp } from "../../utils/generateOtp.js";
import config from "../../config/config.js";
import nodemailer from "nodemailer";

const getAllUsers = async () => {
    const result = await User.find({}).select("-password");
    if (!result.length) {
        const error = new Error("No users found");
        error.statusCode = 404;
        throw error;
    }

    return { message: "Users retrieved successfully", users: result };
};

const getUserById = async (id) => {
    const result = await User.findById(id).select("-password");
    if (!result) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return { message: "User retrieved successfully", user: result };
};

const registerUser = async (userData) => {
    const { email, name, password, photoURL } = userData;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409; // Conflict
        throw error;
    }

    // 2️⃣ Hash the password
    const hashedPassword = await hashPassword(password);

    // 3️⃣ Create user
    const user = await User.create({
        email,
        name,
        password: hashedPassword,
        photoURL,
    });
    delete user.password;

    // 4️⃣ Generate JWT
    const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    return {
        message: "Registered successful",
        user: user,
        token: token,
    };
};

const loginUser = async (loginData) => {
    const { email, password } = loginData;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("No user found with this email!");
        error.statusCode = 401;
        throw error;
    }

    // 2️⃣ Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid password");
        error.statusCode = 401;
        throw error;
    }

    // 3️⃣ Update lastSignInTime
    user.lastSignInTime = new Date();
    await user.save(); // persist the change

    // 4️⃣ Generate JWT
    const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });
    delete user.password;

    return {
        message: "Login successful!",
        user: user,
        token: token,
    };
};

const deleteUserById = async (id) => {
    // 1️⃣ Find user by ID
    const user = await User.findById(id);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // 2️⃣ Delete the user
    await User.findByIdAndDelete(id);

    return {
        message: "User deleted successfully",
        userId: id,
    };
};

const updateUserById = async (id, updateData) => {
    // 1️⃣ Find user by ID
    const user = await User.findById(id);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // 2️⃣ Prevent email update (extra safety)
    if (updateData.email) {
        const error = new Error("Email cannot be updated");
        error.statusCode = 400;
        throw error;
    }

    // 3️⃣ Hash password if provided
    if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
    }

    // 4️⃣ Get updated field names & first letter capitalize
    const updatedFields = Object.keys(updateData).map(
        (field) => field.charAt(0).toUpperCase() + field.slice(1)
    );

    // 5️⃣ Update user
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password");

    return {
        message: `${updatedFields.join(", ")} updated successfully`,
        user: updatedUser,
    };
};

const forgetPassword = async (email) => {
    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("No user found with this email!");
        error.statusCode = 401;
        throw error;
    }

    // 2️⃣ generate otp
    const otp = generateOtp();

    // 3️⃣ update user
    await User.findOneAndUpdate(
        { email },
        {
            resetOtp: otp,
            resetOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
        { new: true }
    );

    // 4️⃣ create transport for sending email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.nodemailer.email,
            pass: config.nodemailer.pass,
        },
    });

    // 5️⃣ send otp via email
    const htmlContent = `
        <div style="background-color: #f5f5f5; padding: 20px 0">
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="font-family: Arial, sans-serif"
            >
                <tr>
                    <td align="center">
                        <table
                            width="600"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                                background: #ffffff;
                                border-radius: 10px;
                                overflow: hidden;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                            "
                        >
                            <!-- Header -->
                            <tr>
                                <td
                                    style="
                                        background: linear-gradient(
                                            to right,
                                            #ffae00,
                                            #ff8a00
                                        );
                                        padding: 20px;
                                        text-align: center;
                                    "
                                >
                                    <h2
                                        style="
                                            margin: 0;
                                            color: #ffffff;
                                            font-size: 22px;
                                        "
                                    >
                                        One-Time Password
                                    </h2>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding: 30px; color: #333333">
                                    <p style="margin-top: 0">
                                        Dear <strong>${user.name}</strong>,
                                    </p>

                                    <p>
                                        We received a request to reset your
                                        <strong>FoodWagon</strong> password. Use
                                        the OTP below to continue:
                                    </p>

                                    <div
                                        style="
                                            margin: 25px 0;
                                            text-align: center;
                                        "
                                    >
                                        <span
                                            style="
                                                display: inline-block;
                                                padding: 12px 24px;
                                                font-size: 28px;
                                                font-weight: bold;
                                                letter-spacing: 4px;
                                                color: #ffffff;
                                                background: linear-gradient(
                                                    to right,
                                                    #ffae00,
                                                    #ff8a00
                                                );
                                                border-radius: 6px;
                                            "
                                        >
                                            ${otp}
                                        </span>
                                    </div>

                                    <p style="color: #555555; font-size: 14px">
                                        ⏱ This OTP is valid for
                                        <strong>5 minutes</strong>.
                                    </p>

                                    <p style="color: #555555; font-size: 14px">
                                        If you didn’t request this, you can
                                        safely ignore this email or contact our
                                        support team.
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    style="
                                        padding: 20px;
                                        border-top: 1px solid #eeeeee;
                                        text-align: center;
                                    "
                                >
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        align="center"
                                    >
                                        <tr>
                                            <td>
                                                <img
                                                    src="https://i.ibb.co.com/HL6fd9Xh/logo.png"
                                                    alt="FoodWagon"
                                                    width="36"
                                                    style="display: block"
                                                />
                                            </td>
                                            <td style="padding-left: 10px">
                                                <span
                                                    style="
                                                        font-size: 22px;
                                                        font-weight: 700;
                                                        color: #f17228;
                                                    "
                                                >
                                                    food<span
                                                        style="color: #ffb30e"
                                                        >wagon</span
                                                    >
                                                </span>
                                            </td>
                                        </tr>
                                    </table>

                                    <p
                                        style="
                                            margin: 10px 0 0;
                                            font-size: 12px;
                                            color: #999999;
                                        "
                                    >
                                        © ${new Date().getFullYear()} FoodWagon. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    `;

    await transporter.sendMail(
        {
            from: config.nodemailer.email,
            to: email,
            subject: "OTP for FoodWagon Login",
            html: htmlContent,
        },
        (err, info) => {
            if (err) {
                console.error(err);
                return "Failed to send OTP email";
            }
        }
    );

    return {
        message: "OTP sent successfully",
    };
};

export const userService = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    deleteUserById,
    updateUserById,
    forgetPassword,
};
