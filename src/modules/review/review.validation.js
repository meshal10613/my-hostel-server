import { z } from "zod";

const idParamSchema = z.object({
    id: z
        .string({ message: "Id must be a string" })
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

const createReviewSchema = z.object({
    mealId: z.string({ message: "mealId must be a string" }),
    userId: z.string({ message: "userId must be a string" }),
    rating: z.number({ message: "rating must be a number" }).min(1).max(5),
    comment: z.string({ message: "comment must be a string" }),
});

export const reviewValidation = {
    idParamSchema,
    createReviewSchema,
};
