const { prisma } = require("../config/db");

const getReviews = async (email) => {
    if (email) {
        return prisma.review.findMany({ where: { ratingUserEmail: email } });
    }
    return prisma.review.findMany();
};

const createOrUpdateReview = async (data) => {
    const {
        mealId,
        mealTitle,
        mealCategory,
        rating,
        review,
        reviewUserName,
        reviewUserEmail,
        reviewUserPhotoURL,
    } = data;

    const existing = await prisma.review.findFirst({
        where: { AND: [{ mealId }, { reviewUserEmail }] },
    });

    if (existing) {
        return prisma.review.update({
            where: { id: existing.id },
            data: { rating, review, reviewUserName, reviewUserPhotoURL },
        });
    }

    return prisma.review.create({
        data: {
            mealId,
            mealTitle,
            mealCategory,
            rating,
            review,
            reviewUserName,
            reviewUserEmail,
            reviewUserPhotoURL,
        },
    });
};

module.exports = { getReviews, createOrUpdateReview };
