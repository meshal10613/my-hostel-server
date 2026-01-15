import { z } from "zod";

const idParamSchema = z.object({
    id: z
        .string({ message: "Id must be a string" })
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

const registerUserSchema = z.object({
    email: z
        .string({ message: "Email must be a string" })
        .email({ message: "Invalid email address" }),
    name: z
        .string({ message: "Display name must be a string" })
        .min(2, { message: "Name must be at least 2 characters" }),
    password: z
        .string({ message: "Password must be a string" })
        .min(6, { message: "Password must be at least 6 characters" }),
    photoURL: z
        .string({ message: "Photo URL must be a string" })
        .url({ message: "Photo URL must be valid" }),
});

const loginUserSchema = z.object({
    email: z
        .string({ message: "Email must be a string" })
        .email({ message: "Invalid email address" }),
    password: z
        .string({ message: "Password must be a string" })
        .min(6, { message: "Password must be at least 6 characters" }),
});

const updateUserSchema = z.object({
    name: z
        .string({ message: "Name must be a string" })
        .min(2, "Name must be at least 2 characters")
        .optional(),
    password: z
        .string({ message: "Password must be a string" })
        .min(6, "Password must be at least 6 characters")
        .optional(),
    photoURL: z
        .string({ message: "Photo URL must be a string" })
        .url("Photo URL must be valid")
        .optional(),
    role: z.enum(["Admin", "User"]).optional(),
    badge: z.enum(["Bronze", "Silver", "Gold", "Platinum"]).optional(),
});

const emailBodySchema = z.object({
    email: z
        .string({ message: "Email must be a string" })
        .email({ message: "Invalid email address" }),
});

const emailOtpBodySchema = z.object({
    email: z
        .string({ message: "Email must be a string" })
        .email({ message: "Invalid email address" }),
    otp: z
        .string({ message: "OTP must be a string" })
        .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),
});

export const userValidation = {
    idParamSchema,
    registerUserSchema,
    loginUserSchema,
    updateUserSchema,
    emailBodySchema,
    emailOtpBodySchema,
};
