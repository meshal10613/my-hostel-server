const likeService = require("../services/likeService");

const checkLike = async (req, res) => {
    try {
        const result = await likeService.checkLike(req.params.id, req.query.q);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

module.exports = { checkLike };
