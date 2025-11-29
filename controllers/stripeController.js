const Stripe = require("stripe");
const config = require("../config/config");
const { generateTrxId } = require("../config/generateTrxId");
const { createPayment, updatePayment } = require("../services/sslService");
const stripe = new Stripe(config.payment_secret_key);

const createPaymentIntent = async (req, res, next) => {
    try {
        const { ammountInCents, serverData } = req.body;
		const trxid = generateTrxId();
		serverData.trxid = trxid;
        const session = await stripe.paymentIntents.create({
            // Provide the exact Price ID (for example, price_1234) of the product you want to sell
            amount: ammountInCents, //amount in cents
            currency: "bdt",
            payment_method_types: ["card"],
            // return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
        });
		const payment = await createPayment(serverData);
		res.json({clientSecret: session.client_secret});
    } catch (error) {
        next(error);
    }
};

const confirmPayment = async (req, res, next) => {
	try {
		const data = req.body;
		const result = await updatePayment(data);
		res.json(result);
	} catch (error) {
		next(error);
	}
};

module.exports = { createPaymentIntent, confirmPayment };
