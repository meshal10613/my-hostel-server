import Stripe from "stripe";
import config from "./config.js";

const stripe = new Stripe(config.payment.secret_key);

export default stripe;
