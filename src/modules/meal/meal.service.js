import User from "../user/user.model.js";
import Meal from "./meal.model.js";

const getAllMeals = async () => {
    const meals = await Meal.find()
        .populate("userId", "name email photoURL role badge")
        .populate("reviews")
        .populate("likesCount");

    if (!meals.length) {
        const error = new Error("No meals found");
        error.statusCode = 404;
        throw error;
    }

    const result = await Promise.all(
        meals.map(async (meal) => {
            const averageRating =
                meal.reviews.length > 0
                    ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      meal.reviews.length
                    : 0;

            return {
                ...meal.toJSON(),
                averageRating,
            };
        })
    );

    return { message: "Meals retrieved successfully", meals: result };
};

const getMealById = async (mealId) => {
    const meal = await Meal.findById(mealId)
        .populate("userId", "name email photoURL role badge")
        .populate({
            path: "reviews",
            populate: {
                path: "userId",
                select: "name email photoURL",
            },
        })
        .populate("likesCount");

    if (!meal) {
        const error = new Error("Meal not found");
        error.statusCode = 404;
        throw error;
    }

    const averageRating =
        meal.reviews.length > 0
            ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) /
              meal.reviews.length
            : 0;

    return {
        message: "Meal retrieved successfully",
        meal: { ...meal.toJSON(), averageRating },
    };
};

const createMeal = async (mealData) => {
    const user = await User.findById(mealData.userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const createdMeal = await Meal.create(mealData);
    return { message: "Meal created successfully", meal: createdMeal };
};

const updateMeal = async (mealId, updateData) => {
    const meal = await Meal.findById(mealId);
    if (!meal) {
        const error = new Error("Meal not found");
        error.statusCode = 404;
        throw error;
    }

    if (updateData.userId) {
        const error = new Error("Cannot change the owner of the meal");
        error.statusCode = 400;
        throw error;
    }

    const updatedFields = Object.keys(updateData).map(
        (field) => field.charAt(0).toUpperCase() + field.slice(1)
    );

    const updatedMeal = await Meal.findByIdAndUpdate(mealId, updateData, {
        new: true,
    });
    return { message: `${updatedFields.join(", ")} updated successfully`, meal: updatedMeal };
};

const deleteMealById = async (mealId) => {
    const meal = await Meal.findByIdAndDelete(mealId);
    if (!meal) {
        const error = new Error("Meal not found");
        error.statusCode = 404;
        throw error;
    }

	return { message: "Meal deleted successfully"};
};

export const mealService = {
    getAllMeals,
    getMealById,
    createMeal,
    updateMeal,
	deleteMealById
};
