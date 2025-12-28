import { z } from "zod";

const idParamSchema = z.object({
    id: z
        .string({ message: "Id must be a string" })
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

const createMealSchema = z.object({
    userId: z
        .string({ message: "userId must be a string" })
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
    title: z.string({ message: "title must be a string" }),
    category: z.string({ message: "category must be a string" }),
    image: z
        .string({ message: "image must be a string" })
        .url({ message: "Image must be valid" }),
    description: z.string({ message: "description must be a string" }),
    ingredients: z.array(
        z.string({ message: "ingredients must be an array of strings" })
    ),
    price: z.number({ message: "price must be a number" }),
});

const updateMealSchema = createMealSchema.omit({ userId: true }).partial();

export const mealValidation = {
    idParamSchema,
    createMealSchema,
    updateMealSchema,
};
