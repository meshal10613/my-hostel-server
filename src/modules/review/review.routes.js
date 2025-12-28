import { Router } from "express";
import { reviewController } from "./review.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { reviewValidation } from "./review.validation.js";

const router = Router();

router.get("/", reviewController.getAllReviews);
router.get(
    "/:id",
    validate(reviewValidation.idParamSchema, "params"),
    reviewController.getReviewById
);
router.get(
    "/user/:id",
    validate(reviewValidation.idParamSchema, "params"),
    reviewController.getReviewByUserId
);

export const reviewRoutes = router;
