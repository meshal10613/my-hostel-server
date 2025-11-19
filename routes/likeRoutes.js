const express = require("express");
const { checkLike } = require("../controllers/likeController");
const router = express.Router();

router.get("/:id", checkLike);

module.exports = router;
