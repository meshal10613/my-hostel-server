import { Router } from "express";
import { likeController } from "./like.controller.js";

const router = Router();

router.get("/", likeController.getAllLikes);
router.patch("/:mealId", likeController.MutateLikeById);

export const likeRoutes = router;