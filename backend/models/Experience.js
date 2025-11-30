const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            maxlength: 50,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        location: {
            name: {
                type: String,
                required: true,
                trim: true,
            },

            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: function (arr) {
                        return Array.isArray(arr) && arr.length === 2;
                    },
                    message: "Coordinates must be [latitude, longitude]",
                },
            },
        },

        images: {
            type: [String],
            default: [],
        },

        averageRating: {
            type: Number,
            default: 0
        },

        date_traveled: {
            type: Date,
        },

        keywords: {
            type: [String],
            default: [],
            index: true,
        },

        visibility: {
            type: String,
            enum: ["public", "private", "unlisted"],
            required: true,
            default: "public",
            index: true,
        }
    },
    {
        collection: "Experiences",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
)

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Experience;