//? If use prisma then------------------>
const { PrismaClient } = require("@prisma/client");
/** @type {PrismaClient} */
const prisma = new PrismaClient;

module.export = prisma;