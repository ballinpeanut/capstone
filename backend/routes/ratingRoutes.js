const express = require("express");
const {verifyToken} = require("../middleware/authHandler");

const { addRating } = require("../controllers/ratingController");
const router = express.Router();

// Routes
router.route("/:experienceId").post(verifyToken, addRating);

module.exports = router;