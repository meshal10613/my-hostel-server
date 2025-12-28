import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        paymentMethod: { type: String, required: true },
        packageName: { type: String, required: true },
        price: { type: Number, required: true },
        benefits: { type: [String], required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        status: { type: String, required: true },
        trxid: { type: String, required: true, unique: true },
    },
    { collection: "payments", timestamps: true, versionKey: false }
);

export default mongoose.model("Payment", paymentSchema);
