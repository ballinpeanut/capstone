const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Rating = require("../models/Rating");
const Experience = require("../models/Experience");

// Add Rating
// @route POST api/ratings/:experienceId
// private access
const addRating = asyncHandler (async (req, res) => {
    const { experienceId } = req.params;
    const { score } = req.body;

    // Validate experienceId
    const validExperience = await Experience.findById(experienceId);
    if (!validExperience){
        return res.status(400).json({ message: "Invalid Experience ID"});
    }

    if (!score) {
        return res.status(400).json({message: "Please add a score"});
    };

    /* check if the user already did the rating for experiece
    If the user already added the rating, it will update existing Rating,
    otherwise, it will create new Rating from the user to that experience
    */
    const findRating = await Rating.findOne({
        user_id: req.user._id,
        experience_id: experienceId
    });

    let newRating;
    if (!findRating){
        newRating = await Rating.create({
        experience_id: experienceId,
        user_id : req.user._id,
        score
    });
    } else {
        newRating = await Rating.findByIdAndUpdate(
            findRating._id,
            { score, review },
            { new: true }
        );
    };

    // await newRating.save();

    // Do the average Rating calculations using aggregate
    const totalAvg = await Rating.aggregate([
        {$match: {
            experience_id: new mongoose.Types.ObjectId(experienceId)
        }},
        { $group: {
            _id: "$experience_id", averageRating: {$avg: "$score" }
        }},
    ]);

    // Check if there is no rating yet
    const average = totalAvg.length > 0 ? totalAvg[0].averageRating : 0;

    // Update average score for that experience
    await Experience.findByIdAndUpdate(experienceId, {averageRating: average});

    console.log(`New Rating was added.\nFor ${validExperience.title} average rating is updated.`);
    res.status(201).json({
        message: "Rating is added",
        experience: validExperience.title,
        experienceId: validExperience.id,
        user_id: newRating.user_id,
        rating: newRating.score,
        averageRating: average});
});

module.exports = { addRating };