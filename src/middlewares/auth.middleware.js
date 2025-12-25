const jwt = require("jsonwebtoken");
const config = require("../config/config");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized Access" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.jwt_secret);
        req.user = decoded; // { id, email, role }
        next();
    } catch (error) {
        return res.status(500).json({
            path: req.url,
            success: false,
            message: error.message,
            details: error,
        });
    }
};

module.exports = authMiddleware;
