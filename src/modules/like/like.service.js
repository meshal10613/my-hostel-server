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

export const likeService = { getAllLikes };
