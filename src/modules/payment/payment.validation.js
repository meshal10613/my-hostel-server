import z from "zod";

const emailParamSchema = z.object({
	email: z
		.string({ message: "Email must be a string" })
		.email({ message: "Invalid email address" }),
});

const PaymentMethodEnum = ["Stripe", "SSLCommerz"];

const PackageNameEnum = ["Silver", "Gold", "Platinum"];

const PaymentStatusEnum = [
    "Initiated",
    "Pending",
    "Success",
    "Failed",
    "Cancelled",
    "Refunded",
    "PartiallyRefunded",
];

const createPaymentSchema = z.object({
    paymentMethod: z.enum(PaymentMethodEnum, {
        message: "Payment method must be Stripe or SSLCommerz",
    }),
    packageName: z.enum(PackageNameEnum, {
        message: "Package name must be Silver, Gold, or Platinum",
    }),
    price: z.number().positive({ message: "Price must be a positive number" }),
    benefits: z.array(
        z.string().min(1, { message: "Benefit cannot be empty" })
    ),
    userName: z.string().min(1, { message: "User name is required" }),
    userEmail: z.string().email({ message: "Invalid email address" }),
    status: z.enum(PaymentStatusEnum, {
        message:
            "Status must be Initiated, Pending, Success, Failed, Cancelled, Refunded, or PartiallyRefunded",
    }),
    trxid: z
        .string()
        .min(1, { message: "Transaction ID is required" })
        .startsWith("TRX-", { message: "Transaction ID must start with TRX-" })
});

export const paymentValidation = {
	emailParamSchema,
    createPaymentSchema,
};
