const likeService = require("../services/likeService");

const checkLike = async (req, res, next) => {
    try {
        const result = await likeService.checkLike(req.params.id, req.query.q);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { checkLike };
