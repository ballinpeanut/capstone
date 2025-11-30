const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        experience_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience",
            required: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        score: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
    },
    {
        collection: "Ratings",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
)

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;