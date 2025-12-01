const { prisma } = require("../config/db");

const getUsers = async (search) => {
    if (search) {
        return prisma.user.findMany({
            where: {
                OR: [
                    { displayName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            },
            orderBy: { creationTime: "desc" },
        });
    }
    return prisma.user.findMany();
};

const createOrUpdateUser = async (data) => {
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

const updateBadge = async (email, badge) => {
    return prisma.user.update({
        where: { email },
        data: { badge },
    });
};

module.exports = { getUsers, createOrUpdateUser, makeAdmin, updateBadge };