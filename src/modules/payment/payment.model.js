import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        paymentMethod: {
            type: String,
            enum: ["Stripe", "SSLCommerz"],
            required: true,
        },
        packageName: {
            type: String,
            enum: ["Silver", "Gold", "Platinum"],
            required: true,
        },
        price: { type: Number, required: true },
        benefits: { type: [String], required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        status: {
            type: String,
            enum: [
                "Initiated",
                "Pending",
                "Success",
                "Failed",
                "Cancelled",
                "Refunded",
                "PartiallyRefunded",
            ],
            default: "Initiated",
        },
        trxid: { type: String, required: true, unique: true },
    },
    { collection: "payments", timestamps: true, versionKey: false }
);

export default mongoose.model("Payment", paymentSchema);
