import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true },
        password: { type: String, required: true, minlength: 6 },
        photoURL: { type: String, required: true },
        role: {
            type: String,
            enum: ["Admin", "User"],
            default: "User",
            required: true,
        },
        badge: {
            type: String,
            enum: ["Bronze", "Silver", "Gold", "Platinum"],
            default: "Bronze",
            required: true,
        },
        resetOtp: { type: String, default: null },
        resetOtpExpires: { type: Date, default: null },
        creationTime: { type: Date, default: Date.now },
        lastSignInTime: { type: Date, default: Date.now },
    },
    { collection: "users", versionKey: false }
);

export default mongoose.model("User", userSchema);
