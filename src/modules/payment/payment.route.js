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
    "/",
    validate(paymentValidation.createPaymentSchema),
    paymentController.createPayment
);

//? PATCH
router.patch(
    "/:id",
	validate(paymentValidation.idParamSchema, "params"),
    validate(paymentValidation.updatePaymentSchema),
    paymentController.updatePaymentStatus
);

export const paymentRoutes = router;
