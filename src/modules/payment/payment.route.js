import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { paymentValidation } from "./payment.validation.js";

const router = Router();

//? GET
router.get("/", paymentController.getAllPayments);
router.get(
    "/:email",
    validate(paymentValidation.emailParamSchema, "params"),
    paymentController.getPaymentsByEmail
);

//? POST
router.post(
    "/stripe/create-payment-intent",
    validate(paymentValidation.createPaymentSchema, "body"),
    paymentController.createPayment
);

//? PATCH
router.patch(
    "/stripe/confirm-payment-intent",
    validate(paymentValidation.updatePaymentSchema, "body"),
    paymentController.updatePaymentStatus
);

export const paymentRoutes = router;
