import User from "./user.model.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";

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
        message: "Login successful",
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

export const userService = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    deleteUserById,
    updateUserById,
};
