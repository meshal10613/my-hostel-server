import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { paymentValidation } from "./payment.validation.js";

const router = Router();

router.get("/", paymentController.getAllPayments);
router.get(
    "/:email",
    validate(paymentValidation.emailParamSchema, "params"),
    paymentController.getPaymentsByEmail
);

export const paymentRoutes = router;
