const express = require("express");
const {
    getUsers,
    createOrUpdateUser,
    makeAdmin,
    forgetPassword,
    verifyOtp,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.post("/", createOrUpdateUser);
router.patch("/admin/:id", makeAdmin);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOtp);

module.exports = router;
