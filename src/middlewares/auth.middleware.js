import { verifyToken } from "../utils/jwt.js";

export const auth = (allowedRoles = [], checkOwnership = false) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(401).json({ message: "Unauthorized Access" });
            }

            const decoded = verifyToken(token);
            req.user = decoded;

            // 1️⃣ Role check
            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res
                    .status(403)
                    .json({ message: "Forbidden: Insufficient role" });
            }

            // 2️⃣ Ownership check
            if (
                checkOwnership
                // decoded.role !== "Admin" && //? then admin can access all
            ) {
                const { id, email } = req.params;

                let isOwner = false;

                if (id && decoded.id === id) {
                    isOwner = true;
                }

                if (email && decoded.email === email) {
                    isOwner = true;
                }

                if (!isOwner) {
                    return res.status(403).json({
                        message:
                            "Forbidden: You can only access your own resource",
                    });
                }
            }

            next();
        } catch (error) {
            return res
                .status(401)
                .json({ message: "Invalid token", error: error.message });
        }
    };
};

export default auth;
