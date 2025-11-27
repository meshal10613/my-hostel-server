const axios = require("axios");
const { ObjectId } = require("mongodb");
const config = require("../config/config");
const { createPayment, updatePayment, getPaymentByTransactionId, deletePaymentById } = require("../services/sslService");
const { generateTrxId } = require("../config/generateTrxId");

const createSSLPayment = async (req, res, next) => {
    try {
        const data = req.body;
        const trxid = generateTrxId();
        const initiate = {
            store_id: config.ssl_store_id,
            store_passwd: config.ssl_store_pass,
            total_amount: data.price,
            currency: "BDT",
            tran_id: trxid,

            success_url: "http://localhost:3000/ssl/success-payment",
            fail_url: "http://localhost:3000/ssl/fail-payment",
            cancel_url: "http://localhost:3000/ssl/cancel-payment",
            ipn_url: "http://localhost:3000/ssl/ipn-success-payment", //not mandetory

            cus_name: data.userName,
            cus_email: data.userEmail,
            cus_add1: "Nalchity",
            cus_city: "Jhalakathi",
            cus_postcode: 8200,
            cus_country: "Bangladesh",
            cus_phone: "01764447574",

            shipping_method: "Courier",
            ship_name: data.userName,
            ship_add1: "Nalchity",
            ship_city: "Jhalakathi",
            ship_postcode: 8200,
            ship_country: "Bangladesh",

            product_name: `Meal Subscription ${data.packageName}`,
            product_category: data.packageName,
            product_profile: "physical-goods",
        };
        const response = await axios.post(
            "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            initiate,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        data.trxid = trxid;
        const payment = await createPayment(data);
        res.status(200).json({
            GatewayPageURL: response.data.GatewayPageURL,
            sessionkey: response.data.sessionkey,
            status: response.data.status,
        });
    } catch (error) {
        next(error);
    }
};

const successSSLPayment = async (req, res, next) => {
    try {
        const paymentSuccess = req.body;
        //? Validation
        const { data } = await axios.get(
            `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${paymentSuccess.val_id}&store_id=${paymentSuccess.store_id}&store_passwd=${config.ssl_store_pass}`
        );
        if (data.status !== "VALID") {
            console.log("Invalid Payment", data);
            return res.send({ message: "Invalid Payment" });
        }

        //? update payment status in database
        const updateData = {
            trxid: paymentSuccess.tran_id,
            status: "Success",
        };
        const updateP = await updatePayment(updateData);
        if (updateP.count === 1) {
			//? find payment by transaction id
			const findPayment = await getPaymentByTransactionId(paymentSuccess.tran_id);
			//? delete payment by id
			const deletePayment = await deletePaymentById(findPayment.id);
			return res.redirect(config.client_url + "/success-payment");
        };
    } catch (error) {
        next(error);
    }
};

module.exports = { createSSLPayment, successSSLPayment };
