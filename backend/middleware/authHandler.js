const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const verifyToken = asyncHandler(async (req, res, next) => {
    // get token from JWT stored in user's cookies
    const token = req.cookies?.token;

    if (!token) {
        res.status(401);
        throw new Error("User not authorized.");
    }

    try {
        // decode the token
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const userId = tokenData.userId || tokenData.id

        // find user using the token, don't retrieve password
        const user = await User.findById(tokenData.userId).select("-password");

        // valid token but user not in database anymore
        if (!user) {
            res.status(401);
            throw new Error("User not found. Not Authorized.");
        }
        // store authenticated user's data, serves as a protected route now
        req.user = user;

        // next request continues on a protected route
        next();
    } catch {
        // unable to verify token
        res.status(401);
        throw new Error("Not authorized. Invalid or expired token.")
    }
});

module.exports = {verifyToken};