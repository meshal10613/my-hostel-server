import { Router } from "express";
import { mealController } from "./meal.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { mealValidation } from "./meal.validation.js";

const router = Router();

//? GET
router.get(
    "/",
    validate(mealValidation.categoryQuerySchema, "query"),
    mealController.getAllMeals
);
router.get(
    "/:id",
    validate(mealValidation.idParamSchema, "params"),
    mealController.getMealById
);

//? POST
router.post(
    "/",
    validate(mealValidation.createMealSchema, "body"),
    mealController.createMeal
);

//? PATCH
router.patch(
    "/:id",
    validate(mealValidation.idParamSchema, "params"),
    validate(mealValidation.updateMealSchema, "body"),
    mealController.updateMeal
);

//? DELETE
router.delete(
    "/:id",
    validate(mealValidation.idParamSchema, "params"),
    mealController.deleteMealById
);

export const mealRoutes = router;
