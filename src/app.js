import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { mealRoutes } from "./modules/meal/meal.routes.js";
import { reviewRoutes } from "./modules/review/review.routes.js";
import { likeRoutes } from "./modules/like/like.routes.js";
import { paymentRoutes } from "./modules/payment/payment.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server is running....!");
})

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meals", mealRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.use(errorMiddleware);
app.use((req, res) => {
    res.status(req.statusCode || 404).json({
        path: req.url,
        success: false,
        message: "Not Found!",
    });
});

export default app;
