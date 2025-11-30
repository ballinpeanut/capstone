const express = require("express");
const {verifyToken} = require("../middleware/authHandler");
const router = express.Router();
const { 
    getAllTrips,
    getUserTrips,
    createTrip, 
    getTrip, 
    updateTrip, 
    deleteTrip,
    addExperienceToTrip, 
    searchMyTrips,
    searchAllTrips
 } = require("../controllers/tripController");

 // public search and view
router.get("/search", searchAllTrips);
router.get("/", getAllTrips);

// private: only view + search user's own trips
router.get("/my-trips", verifyToken, getUserTrips);
router.get("/my-trips/search", verifyToken, searchMyTrips);

// public: view single trip
router.get("/:id", getTrip);

// private CRUD routes
router.post("/", verifyToken, createTrip);
router.put("/:id", verifyToken, updateTrip);
router.delete("/:id", verifyToken, deleteTrip);

router.route("/:tripId/addExperience").post(verifyToken, addExperienceToTrip);

module.exports = router;