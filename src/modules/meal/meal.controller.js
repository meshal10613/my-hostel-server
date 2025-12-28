import { mealService } from "./meal.service.js";

const getAllMeals = async (req, res, next) => {
    try {
        const result = await mealService.getAllMeals();
        res.status(200).json({
            success: true,
            message: result.message,
            totalMeals: result.meals.length,
            data: result.meals,
        });
    } catch (error) {
        next(error);
    }
};

const getMealById = async (req, res, next) => {
    try {
        const mealId = req.params.id;
        const result = await mealService.getMealById(mealId);
        res.status(200).json({
            success: true,
            message: result.message,
            data: result.meal,
        });
    } catch (error) {
        next(error);
    }
};

const createMeal = async (req, res, next) => {
    try {
        const mealData = req.body;
        const result = await mealService.createMeal(mealData);
        res.status(201).json({
            success: true,
            message: result.message,
            data: result.meal,
        });
    } catch (error) {
        next(error);
    }
};

const updateMeal = async (req, res, next) => {
    try {
		const mealId = req.params.id;
		const updateData = req.body;
		const result = await mealService.updateMeal(mealId, updateData);
		res.status(200).json({
			success: true,
			message: result.message,
			data: result.meal,
		});
    } catch (error) {
        next(error);
    }
};

const deleteMealById = async (req, res, next) => {
	try {
		const mealId = req.params.id;
		const result = await mealService.deleteMealById(mealId);
		res.status(200).json({
			success: true,
			message: result.message
		});
	} catch (error) {
		next(error);
	}
};

export const mealController = {
    getAllMeals,
    getMealById,
    createMeal,
    updateMeal,
	deleteMealById
};
