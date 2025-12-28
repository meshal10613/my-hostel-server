import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
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
    },
    { collection: "likes", versionKey: false }
);

likeSchema.index({ mealId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);