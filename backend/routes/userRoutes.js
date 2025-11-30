const express = require("express");
const {verifyToken} = require("../middleware/authHandler");

const { registerUser, loginUser, logoutUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", verifyToken, (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
    });
});

module.exports = router; 