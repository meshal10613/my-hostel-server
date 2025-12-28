import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken = (payload) => {
    if (!config.jwt.secret) throw new Error("JWT secret is not set in config");
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expires_in,
    });
};

export const verifyToken = (token) => jwt.verify(token, config.jwt.secret);

export const decodeToken = (token) => jwt.decode(token);
