const mealService = require("../services/mealService");

const getMeals = async (req, res, next) => {
    try {
        const meals = await mealService.getMeals(req.query.category, req.query.search);
        res.json(meals);
    } catch (err) {
        next(err);
    }
};

const getMealById = async (req, res, next) => {
    try {
        const meal = await mealService.getMealById(req.params.id);
        res.json(meal);
    } catch (err) {
        next(err);
    }
};

const createMeal = async (req, res, next) => {
    try {
        const meal = await mealService.createMeal(req.body);
        res.json(meal);
    } catch (err) {
        next(err);
    }
};

const deleteMeal = async (req, res, next) => {
    try {
        const result = await mealService.deleteMeal(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const likeMeal = async (req, res, next) => {
    try {
        const meal = await mealService.likeMeal(req.params.id, req.body);
        res.json(meal);
    } catch (err) {
        next(err);
    }
};

module.exports = { getMeals, getMealById, createMeal, deleteMeal, likeMeal };
