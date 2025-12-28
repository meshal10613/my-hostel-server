import { likeService } from "./like.service.js";

const getAllLikes = async (req, res, next) => {
    try {
		const result = await likeService.getAllLikes();
        res.status(200).json({
            success: true,
            message: result.message,
            totalLikes: result.likes.length,
            data: result.likes,
        });
    } catch (error) {
        next(error);
    }
};

export const likeController = { getAllLikes };
