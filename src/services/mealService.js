const { prisma } = require("../config/db");

const getMeals = async(category, search) => {
    const meals = await prisma.meal.findMany({
        where: {
            AND: [
                category ? { category } : {},
                search ? { 
					OR: [
					{ title: { contains: search, mode: "insensitive" } }
					] 
				} 
				: {},
            ],
        },
        include: { reviews: true },
    });

    return meals.map(meal => {
        const avgRating = meal.reviews.length
            ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / meal.reviews.length
            : 0;
        return { ...meal, rating: parseFloat(avgRating.toFixed(2)) };
    });
}

const getMealById = async(id) => {
    const meal = await prisma.meal.findUnique({
        where: { id },
        include: { reviews: true },
    });
    meal.rating = meal.reviews.length
        ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / meal.reviews.length
        : 0;
    return meal;
}

const createMeal = async(data) => {
    const {
        title,
        category,
        image,
        description,
        ingredients,
        price,
        distributerName,
        distributerEmail,
    } = data;

    if (!title || !category || !image || !description || !ingredients || !price)
        throw new Error("Missing required fields");

    return prisma.meal.create({
        data: {
            title,
            category,
            image,
            description,
            ingredients,
            price,
            distributerName,
            distributerEmail,
            rating: 0,
            reviews: [],
            likes: 0,
        },
    });
}

const deleteMeal = (id) => {
    return prisma.meal.delete({ where: { id } });
}

const likeMeal = async(id, userData) => {
    const meal = await prisma.meal.update({
        where: { id },
        data: { likes: { increment: 1 } },
    });

    await prisma.likes.create({
        data: {
            mealId: id,
            userName: userData.userName,
            userEmail: userData.userEmail,
        },
    });

    return meal;
}

module.exports = { getMeals, getMealById, createMeal, deleteMeal, likeMeal };
