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

export const paymentService = {
    getAllPayments,
    getPaymentsByEmail,
};
