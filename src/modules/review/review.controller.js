import { reviewService } from "./review.service.js";

const getAllReviews = async (req, res, next) => {
    try {
        const result = await reviewService.getAllReviews();
        res.status(200).json({
            success: true,
            message: result.message,
            totalReviews: result.reviews.length,
            data: result.reviews,
        });
    } catch (error) {
        next(error);
    }
};

const getReviewById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await reviewService.getReviewById(id);
		res.status(200).json({
			success: true,
			message: result.message,
			data: result.review,
		});
	} catch (error) {
		next(error);
	}
};

const getReviewByUserId = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await reviewService.getReviewByUserId(id);
		res.status(200).json({
			success: true,
			message: result.message,
			data: result.review,
		});
	} catch (error) {
		next(error);
	}
};

export const reviewController = {
    getAllReviews,
	getReviewById,
	getReviewByUserId
};
