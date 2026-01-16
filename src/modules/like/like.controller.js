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

const MutateLikeById = async (req, res, next) => {
    try {
        const { mealId } = req.params;
        const { email } = req.body;
        const result = await likeService.MutateLikeById(mealId, email);
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

export const likeController = { getAllLikes, MutateLikeById };
