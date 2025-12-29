import User from "../user/user.model.js";
import Payment from "./payment.model.js";

const getAllPayments = async () => {
    const result = await Payment.find();
    return result;
};

const getPaymentsByEmail = async (email) => {
    const result = await Payment.find({ userEmail: email });
    if (!result.length) {
        const error = new Error("No payments found");
        error.statusCode = 404;
        throw error;
    }

    return { message: "Payments retrieved successfully", payments: result };
};

const createPayment = async (paymentData) => {
    const { userName, userEmail } = paymentData;

    // Check if the user exists
    const user = await User.findOne({ name: userName, email: userEmail });
    if (!user) {
        const error = new Error("User does not exist");
        error.statusCode = 404;
        throw error;
    }

    // Create the payment if user exists
    const result = await Payment.create(paymentData);
    return result;
};

const updatePaymentStatus = async (id, updateData) => {
    const payment = await Payment.findById(id);
    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }
    const result = await Payment.findByIdAndUpdate(id, updateData, {
        new: true,
    });
    return { message: "Payment status updated successfully", data: result };
};

export const paymentService = {
    getAllPayments,
    getPaymentsByEmail,
    createPayment,
    updatePaymentStatus,
};
