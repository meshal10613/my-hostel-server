const { prisma } = require("../config/db");

async function checkLike(mealId, userEmail) {
    return prisma.likes.findFirst({
        where: { AND: [{ mealId }, { userEmail }] },
    });
}

module.exports = { checkLike };
