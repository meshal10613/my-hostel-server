const express = require("express");
const {
    getUsers,
    createOrUpdateUser,
    makeAdmin,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.post("/", createOrUpdateUser);
router.patch("/admin/:id", makeAdmin);

module.exports = router;
