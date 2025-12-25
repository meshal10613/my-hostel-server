const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (payload) => {
    return jwt.sign(payload, config.jwt_secret, {
        expiresIn: config.jwt_expires_in,
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, config.jwt_secret);
};

module.exports = { generateToken, verifyToken };
