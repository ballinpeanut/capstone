// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
           
            // verify the token signature
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // find the user and attach to request
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ message: "Not authorized. User not found." });
            }

            // Check if the token sent in the request header is still present in the user's array of valid tokens.
            const tokenExists = user.tokens.some(t => t.token === token);

            if (!tokenExists) {
                // Token was removed by the logoutUser function.
                return res.status(401).json({ 
                    message: "Not authorized. Token has been revoked." 
                });
            }

            req.user = user;
            console.log("Protect Middleware: Calling next() - Request is authorized.");
            return next();
        } catch (e) {
            console.error("Authentication Error:", e.message);
            return res.status(401).json({ message: "Not authorized. Invalid token." });
        }
    }

    return res.status(401).json({ message: "No token provided" });
};

module.exports = protect;
