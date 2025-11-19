const { prisma } = require("../config/db");

const getUsers = async () => {
    const { search } = req.query;
    if (search) {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { displayName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            },
            orderBy: {
                creationTime: "desc", // optional
            },
        });

        return res.json(users);
    }
    const result = await prisma.user.findMany();
    res.json(result);
};

const createOrUpdateUser = async () => {
    const { email, displayName, photoURL, badge, role } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return prisma.user.update({
            where: { email },
            data: { lastSignInTime: new Date() },
        });
    }

    return prisma.user.create({
        data: { email, displayName, photoURL, badge, role },
    });
};

const makeAdmin = async (id) => {
    return prisma.user.update({
        where: { id },
        data: { role: "admin" },
    });
};

module.exports = { getUsers, createOrUpdateUser, makeAdmin };
