const { prisma } = require("../config/db");

const createPayment = async (data) => {
    const {
        paymentMethod,
        packageName,
        price,
        benefits,
        userName,
        userEmail,
        status,
        trxid,
    } = data;

	return prisma.payment.create({
		data: {
			paymentMethod,
			packageName,
			price,
			benefits,
			userName,
			userEmail,
			status,
			trxid,
		},
	});
};

module.exports = { createPayment };
