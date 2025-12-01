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

const updatePayment = async (data) => {
	return prisma.payment.updateMany({
		where: {
			trxid: data.trxid,
		},
		data: {
			status: data.status,
		},
	});
};

const getPaymentByTransactionId = async (transactionId) => {
	return prisma.payment.findFirst({
		where: {
			trxid: transactionId,
		},
	});
};

const deletePaymentById = async(id) => {
	return prisma.payment.delete({ where: { id } });
}

module.exports = { createPayment, updatePayment, getPaymentByTransactionId, deletePaymentById };
