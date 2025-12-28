import Review from "./review.model.js";

const getAllReviews = async () => {
    const result = await Review.find()
        .populate("mealId", "title category")
        .populate("userId", "name email photoURL");

    if (!result.length) {
        const error = new Error("No reviews found");
        error.statusCode = 404;
        throw error;
    }

    return { message: "Reviews retrieved successfully", reviews: result };
};

const getReviewById = async (id) => {
    const result = await Review.findById(id)
        .populate("mealId", "title category")
        .populate("userId", "name email photoURL");

    if (!result) {
        const error = new Error("Review not found");
        error.statusCode = 404;
        throw error;
    }

    return { message: "Review retrieved successfully", review: result };
};

const getReviewByUserId = async (userId) => {
    const result = await Review.find({ userId })
        .populate("mealId", "title category")
        .populate("userId", "name email photoURL");

    if (!result) {
        const error = new Error("Review not found");
        error.statusCode = 404;
        throw error;
    }

    return { message: "Review retrieved successfully", review: result };
};

export const reviewService = {
    getAllReviews,
    getReviewById,
    getReviewByUserId,
};
