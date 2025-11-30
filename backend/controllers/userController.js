const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const isProd = process.env.NODE_ENV === "production"

// Helper to generate JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET, 
        {expiresIn: "30d",
    });
};

// Register a user
// @route POST api/users/register
// public access
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // check for empty fields
    if (!username || !email || !password) {
        return res.status(400).json({message: "All fields are mandatory."})
    }

    // Check if the user with the same email is already registered
    const userAvailable = await User.findOne( { email });
    if (userAvailable) {
        return res.status(400).json({message: "The user is already registered" });
    };

    // Validate password
    const validPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/;
    if (!validPassword.test(password)) {
        return res.status(400).json({ 
            message: "The password should have at least 8 characters, 1 number and 1 upper case letter"});
    };

    // password hashing
    const passHash = await argon2.hash(password);

    const newUser = await User.create({
        username,
        email,
        password: passHash,
        last_login: new Date()
     });

    console.log("User is successfully registered: ", newUser.username);


    return res.status(201).json({
        message: "Successfully registered user!",
        user: {
            email: newUser.email
        },
    });
});

// Login user
// @route POST api/users/login
// public access
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory.");
    };

    const user = await User.findOne({ email });
    if (!user) {
    return res
        .status(401)
        .json({ message: "Email or password is incorrect. Please try again." });
    }

    /* compare hashedPassword with stored in db
    and generate token
    */
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
    return res
        .status(401)
        .json({ message: "Email or password is incorrect. Please try again." });
    }

    // Update last login
    user.last_login = new Date();

    // Save  on login
    const token = generateToken(user._id);
    
    // const newTokens = user.tokens || [];
    // newTokens.push({
    //     token,
    //     signedAt: Date.now().toString()
    // })
    // user.tokens = newTokens;

    await user.save();

    // authentication token
    // http only where JS cant access cookie
    // secure only sends cookies over HTTPS in production
    // samesite controls cross site requests
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
    });

    console.log("Successfully logged in user:", user.username);

    res.status(200).json({
        message: "Login successful",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username,
        },
        token: token,
    });
    console.log("Login is successful for user: ", user.username);
});

// logout user
// @route api/users/logout
// private access
const logoutUser = asyncHandler (async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });

    console.log("User is successfully signed out.");
    return res.status(200).json({message: "User successfully signed out."})


    // if (!req.user || !req.user.tokens) {
    //     return res.status(401).json({ message: "User data not found from token"})
    // }

    // // retrieve token from header
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) {
    //     return res.status(401).json({ message: "Token not provided."});
    // }

    // const tokens = req.user.tokens;

    // const newTokens = tokens.filter(t => t.token !== token);

    // try {
    //     await req.user.save();
        
    //     console.log("User is successfully signed out."); 
    //     res.status(200).json({ message: "Sign out is successful."});

    // } catch (dbError) {
    //     console.error("LOGOUT FAILED: Database update error:", dbError); 
    //     res.status(500).json({ message: "Logout failed due to server error." });
    // }
})
module.exports = { registerUser, loginUser, logoutUser };
