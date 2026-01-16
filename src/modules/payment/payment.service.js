import Stripe from "stripe";
import { generateTrxId } from "../../utils/generateTrxId.js";
import User from "../user/user.model.js";
import Payment from "./payment.model.js";
import config from "../../config/config.js";
const stripe = new Stripe(config.payment.secret_key);

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
    const trxid = generateTrxId();
    paymentData.trxid = trxid;

    const session = await stripe.paymentIntents.create({
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        amount: paymentData.price, //amount in cents
        currency: "bdt",
        payment_method_types: ["card"],
        // return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    paymentData.status = "Pending";
    await Payment.create(paymentData);
    return {
        clientSecret: session.client_secret,
    };
};

const updatePaymentStatus = async (data) => {
    const { email, status } = data;
    const payment = await Payment.findOne(
        { userEmail: email },
        {
            new: true,
        }
    );
    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }

    const updateData = { status };
    const result = await Payment.findOneAndUpdate(
        { userEmail: email },
        updateData,
        {
            new: true,
        }
    );

    return {
        message: `Payment status updated to ${status} successfully`,
        data: result,
    };
};

export const paymentService = {
    getAllPayments,
    getPaymentsByEmail,
    createPayment,
    updatePaymentStatus,
};
