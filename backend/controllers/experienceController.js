const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Experience = require("../models/Experience");
const verifyToken = require("../middleware/authMiddleware");

// get all experiences
// route GET api/experiences
// access public or private?
const getExperiences = asyncHandler(async (req, res) => {
    const experiences = await Experience.find({});
    res.status(200).json(experiences);
})


// Create Experience
// route POST api/experiences
// access private
const createExperience = asyncHandler (async (req, res) => {
    const {title, date_traveled, description, location, images, keywords, visibility} = req.body;
    if (!title || !date_traveled || !location || !visibility) {
        res.status(400).json({message:"Title, Date, location and visibility fields are mandatory" });
    };

    const newExperience = await Experience.create({
        user_id: req.user._id,
        title,
        date_traveled,
        description,
        location,
        images,
        keywords,
        visibility,
    })
    console.log("The Experience was created!");
    res.status(201).json({ message:"Experience was created", newExperience });
});

// Find experiences by search
// route GET api/experiences/search
// access public
const searchExperiences = asyncHandler (async (req, res) => {
    const { search } = req.query;
    const searchQuery = {};

    if (!search) {
        return res.status(400).json({ message: "Search query is required" });
    }

    // search by keyword or by title or location name
    if (search) {
        searchQuery.$or = [
        { keywords: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { "location.name": { $regex: search, $options: "i"} }
        ];
    };

    const filteredExperiences = await Experience.find(searchQuery);

    if (!filteredExperiences.length) {
        return res.status(200).json([]);
    };

    res.status(200).json(filteredExperiences);
});

// get an experience
// route GET api/experiences/:id
const getExperience = asyncHandler (async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
        res.status(404).json({message:"Experience not found"});
    }
    res.status(200).json(experience);
});


module.exports = {
    getExperiences,
    createExperience,
    searchExperiences,
    getExperience
};