export const validate =
    (schema, property = "body") =>
    (req, res, next) => {
        try {
            // safeParse returns an object instead of throwing
            const result = schema.safeParse(req[property]);

            if (!result.success) {
                const errors = result.error.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            }

            // ✅ DO NOT mutate req.query
            if (property === "query") {
                req.validateQuery = result.data;
            } else {
                req[property] = result.data;
            }

            next();
        } catch (err) {
            // Catch any unexpected errors
            return res.status(500).json({
                success: false,
                message: err.message || "Internal Server Error",
                errors: [],
            });
        }
    };
