const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            maxlength: 50
        },

        username: {
            type: String,
            required: true,
            unique: true,
            maxlength: 50
        },

        password: {
            type: String,
            required: true
        },

        created_at: {
            type: Date,
            required: true,
            default: Date.now
        },

        last_login: {
            type: Date,
            required: true
        },
        tokens: [
            {
                token: {
                 type: String,
                 required: true
                },
                signedAt: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    { collection: "Users"}
)

const User = mongoose.model("User", userSchema);
module.exports = User;