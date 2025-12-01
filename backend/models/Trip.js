const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        trip_name: {
            type: String,
            required: true,
            maxlength: 35,
            trim: true, 
        },

        trip_summary: {
            type: String,
            maxlength: 300, 
            trim: true,  
        },
        experiences: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience"
            }
        ]
    },
    {
        collection: "Trips",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
)

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;