const reviewService = require("../services/reviewService");

const getReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.getReviews(req.params.email);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

const createOrUpdateReview = async (req, res, next) => {
    try {
        const review = await reviewService.createOrUpdateReview(req.body);
        res.json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

module.exports = { getReviews, createOrUpdateReview };
