import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        category: { type: String, enum: ["Breakfast", "Lunch", "Dinner"], required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        ingredients: { type: [String], required: true },
        price: { type: Number, required: true },
        postTime: { type: Date, default: Date.now },
    },
    {
        collection: "meals",
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Reviews array
mealSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "mealId",
});

// Likes count
mealSchema.virtual("likesCount", {
    ref: "Like",
    localField: "_id",
    foreignField: "mealId",
    count: true,
});

// Virtual: average rating from reviews
mealSchema.virtual("averageRating").get(async function () {
    const Review = mongoose.model("Review");
    const reviews = await Review.find({ mealId: this._id });
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / reviews.length;
    return avg;
});

export default mongoose.model("Meal", mealSchema);