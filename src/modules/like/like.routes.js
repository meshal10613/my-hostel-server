import { Router } from "express";
import { likeController } from "./like.controller.js";

const router = Router();

router.get("/", likeController.getAllLikes);

export const likeRoutes = router;