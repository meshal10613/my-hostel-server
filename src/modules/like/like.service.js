import Like from "./like.model.js";

const getAllLikes = async () => {
    const result = await Like.find()
        .populate("userId", "name email")
        .populate("mealId", "title category");
    if (!result.length) {
        const error = new Error("No likes found");
        error.statusCode = 404;
        throw error;
    }
    return { message: "Likes retrieved successfully", likes: result };
};

const MutateLikeById = async (mealId, email) => {
    const like = await Like.findOne({ mealId, email });
    if (!like) {
        await Like.create({ mealId, email });
        return;
    }
    await Like.findOneAndDelete({ mealId, email });
    return;
};

export const likeService = { getAllLikes, MutateLikeById };
