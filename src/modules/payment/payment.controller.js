import { paymentService } from "./payment.service.js";
	
const getAllPayments = async (req, res, next) => {
	try {
		const result = await paymentService.getAllPayments();	
		res.status(200).json({
			success: true,
			message: "Payments retrieved successfully",
			totalPayments: result.length,
			data: result
		});
	} catch (error) {
		next(error);
	}
};

const getPaymentsByEmail = async (req, res, next) => {
	try {
		const { email } = req.params;
		const result = await paymentService.getPaymentsByEmail(email);
		res.status(200).json({
			success: true,
			message: result.message,
			totalPayments: result.length,
			data: result.payments
		});
	} catch (error) {
		next(error);
	}
};

const createPayment = async (req, res, next) => {
	try {
		const result = await paymentService.createPayment(req.body);
		res.status(201).json({
			success: true,
			clientSecret: result.clientSecret
		});
	} catch (error) {
		next(error);
	}
};

const updatePaymentStatus = async (req, res, next) => {
	try {
		const result = await paymentService.updatePaymentStatus(req.body);
		res.status(200).json({
			success: true,
			message: result.message,
			data: result
		});
	} catch (error) {
		next(error);
	}
};

export const paymentController = {
	getAllPayments,
	getPaymentsByEmail,
	createPayment,
	updatePaymentStatus
};