import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        mealId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meal",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: { type: Number, min: 1, max: 5, required: true },
        review: { type: String, required: true },
    },
    { collection: "reviews", versionKey: false }
);

// Optional unique constraint same as Prisma
reviewSchema.index({ mealId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
