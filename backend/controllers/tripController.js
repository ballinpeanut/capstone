const asyncHandler = require("express-async-handler");
const Trip = require("../models/Trip");

/* --------------------------------------------------------------------
Create a trip (private)
@route POST api/trips
---------------------------------------------------------------------- */
const createTrip = asyncHandler (async (req, res) => {
    const {trip_name, trip_summary } = req.body;
    if (!trip_name) {
        res.status(400);
        throw new Error("Title is mandatory");
    }

    const newTrip = await Trip.create({
        user_id: req.user._id,
        trip_name,
        trip_summary
    });
    console.log("Trip is successfully created: ", newTrip);
    res.status(201).json(newTrip);
});

/* --------------------------------------------------------------------
Public Trips (everyone can see the trips)
GET /api/trips
---------------------------------------------------------------------- */
const getAllTrips = asyncHandler(async(req, res) => {
    const trips = await Trip.find()
        .populate("experiences")
        .sort({createdAt: -1});

    res.status(200).json(trips);
});

/* --------------------------------------------------------------------
Get only user created trips (private)
GET /api/trips
---------------------------------------------------------------------- */
const getUserTrips = asyncHandler(async (req, res) => {
    const trips = await Trip.find({ user_id: req.user._id });
    res.status(200).json(trips);
});

/* --------------------------------------------------------------------
Get a single trip (public view)
GET /api/trips/:id
- Anyone should be able to view a trip and the experiences within it
- Only logged in users can perform any CRUD
---------------------------------------------------------------------- */
const getTrip = asyncHandler (async (req, res) => {
    const { id } = req.params;

    const trip = await Trip.findById(id).populate("experiences");

    if(!trip) {
        res.status(404);
        throw new Error("Trip not found");
    };

    res.status(200).json(trip);
});

/* --------------------------------------------------------------------
Update a trip (private, logged in users only)
PUT /api/trips/:id
---------------------------------------------------------------------- */
const updateTrip = asyncHandler (async (req, res) => {
    // find the trip to update
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
        res.status(400);
        throw new Error("Trip no found");
    };

    if (trip.user_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this trip" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedTrip);
    console.log("The trip was updated to: ", updatedTrip);
});

/* --------------------------------------------------------------------
Delete a trip (private, logged in users only)
DELETE /api/trips/:id
---------------------------------------------------------------------- */
const deleteTrip = asyncHandler (async (req, res) => {
    // find the trip to delete
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
        res.status(400);
        throw new Error("Trip not found");
    };

    if (trip.user_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this trip" });
    }

    const deletedTrip = await Trip.deleteOne({ _id: req.params.id });
    res.status(200).json(deletedTrip);
    console.log("The trip was deleted.");
});

/* --------------------------------------------------------------------
Add experience to a trip (private, logged in users only)
POST api/my-trips/:tripId/addExperience
---------------------------------------------------------------------- */
const addExperienceToTrip = asyncHandler (async (req, res) => {
    const { tripId } = req.params;
    const { experience_id } = req.body;
    if (!experience_id) {
        return res.status(400).json({ message: "Experience ID is required!"});
    };

    const trip = await Trip.findById(tripId);
    if (!trip) {
        return res.status(404).json({ message: "Trip not found"});
    };

    if (trip.user_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to modify this trip" });
    }

    // Check if the experience was already added
    if (!trip.experiences.some(result => result.toString() === experience_id)) {
        trip.experiences.push(experience_id);
        await trip.save();
    }
    console.log("Experience was added to trip.");
    const updatedTrip = await Trip.findById(tripId).populate("experiences");

    res.status(200).json({ message: "Experience added to the Trip.", trip: updatedTrip });
});

/* --------------------------------------------------------------------
Search my trips by name (private)
GET api/my-trips/search?q=text
---------------------------------------------------------------------- */
const searchMyTrips = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(400).json({ message: "Query is required" });
    }

    const regex = new RegExp(q, "i"); // case-insensitive match

    const trips = await Trip.find({
        user_id: req.user._id,   // <-- important
        $or: [
            { trip_name: { $regex: regex } },
            { trip_summary: { $regex: regex } }
        ]
    });

    res.status(200).json(trips);
});

/* --------------------------------------------------------------------
Search all trips by name (public)
GET api/trips/search?q=text
---------------------------------------------------------------------- */
const searchAllTrips = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(400).json({ message: "Query is required" });
    }

    const regex = new RegExp(q, "i"); // case-insensitive match

    const trips = await Trip.find({
        $or: [
            { trip_name: { $regex: regex } },
            { trip_summary: { $regex: regex } }
        ]
    });

    res.status(200).json(trips);
});


module.exports = {
    getAllTrips,
    createTrip,
    getUserTrips,
    getTrip,
    updateTrip,
    deleteTrip,
    addExperienceToTrip,
    searchMyTrips,
    searchAllTrips
};