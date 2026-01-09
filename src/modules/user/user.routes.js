import { Router } from "express";
import { userController } from "./user.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { userValidation } from "./user.validation.js";
import auth from "../../middlewares/auth.middleware.js";

const router = Router();

// auth(["Admin"]) -> only admin can access
// auth(["User"], true) -> only user can access their own id only
// auth(["Admin", "User"], true) --> admin can access & user can access their own id only

//? GET
router.get("/", auth(["Admin"]), userController.getAllUsers);
router.get(
    "/:id",
    auth(["Admin", "User"], true),
    validate(userValidation.idParamSchema, "params"),
    userController.getUserById
);

//? POST
router.post(
    "/register",
    validate(userValidation.registerUserSchema, "body"),
    userController.registerUser
);
router.post(
    "/login",
    validate(userValidation.loginUserSchema, "body"),
    userController.loginUser
);
router.post(
    "/forget-password",
    validate(userValidation.emailBodySchema, "body"),
    userController.forgetPassword
);

//? PATCH
router.patch(
    "/:id",
    auth(["User"], true),
    validate(userValidation.idParamSchema, "params"),
    validate(userValidation.updateUserSchema, "body"),
    userController.updateUserById
);

//? DELETE
router.delete(
    "/:id",
    auth(["Admin", "User"], true),
    validate(userValidation.idParamSchema, "params"),
    userController.deleteUserById
);

export const userRoutes = router;
