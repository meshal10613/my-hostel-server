const express = require("express");
const { getReviews, createOrUpdateReview } = require("../controllers/reviewController");
const router = express.Router();

router.get("/", getReviews);
router.get("/:email", getReviews);
router.post("/", createOrUpdateReview);

module.exports = router;
