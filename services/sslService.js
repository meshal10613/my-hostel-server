const { prisma } = require("../config/db");

const createPayment = async(data) => {
	console.log(data)
};

module.exports = { createPayment };