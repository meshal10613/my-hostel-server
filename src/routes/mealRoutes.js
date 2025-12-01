const express = require("express");
const {
    getMeals,
    getMealById,
    createMeal,
    deleteMeal,
    likeMeal,
} = require("../controllers/mealController");
const router = express.Router();

router.get("/", getMeals);
router.get("/:id", getMealById);
router.post("/", createMeal);
router.delete("/:id", deleteMeal);
router.patch("/like/:id", likeMeal);

module.exports = router;
