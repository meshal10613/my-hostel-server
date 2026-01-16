import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        mealId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meal",
            required: true,
        },
        email: {
            type: mongoose.Schema.Types.String,
            ref: "User",
            required: true,
        },
    },
    { collection: "likes", versionKey: false }
);

likeSchema.index({ mealId: 1, email: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);