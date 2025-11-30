const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

// register a user
// POST api/users/register
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // check for empty fields
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Username, email, and password are required.");
    }

    // check if email exists
    const existingEmail = await User.findOne({email});
    if (existingEmail) {
        res.status(400);
        throw new Error("Email already exists.");
    };

    // check if username exists
    const existingUsername = await User.findOne({username});
    if (existingUsername) {
        res.status(400);
        throw new Error("Username already exists.");
    };
        
    // generate hashed password
    const passHash = await argon2.hash(password);
        
    await User.create({
        username,
        email, 
        password: passHash,
        last_login: new Date()
    });

    res.status(201).json({message: "Successfully registered user!"});
});


// login user based on email OR username
// POST api/users/login
const login = asyncHandler(async (req, res) => {
    const {emailOrUsername, password} = req.body;
        
    // empty inputs
    if (!emailOrUsername || !password) {
        res.status(400);
        throw new Error("Email/username and password required.");
    };

    // find user using email or username
    const user = await User.findOne({
        $or: [{email: emailOrUsername}, {username: emailOrUsername}]
        });

    // invalid login info check
    if (!user) {
        res.status(401);
        throw new Error("Invalid email/username or password.");
    };

    // verify password, retrieves hashed password
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
        res.status(401)
        throw new Error("Invalid email/username or password.")
    }

    const isProd = process.env.NODE_ENV === "production";

    // token creation for secure login
    const token = jwt.sign(
        {
            userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        );

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

    // update new login time
    user.last_login = new Date();
    await user.save();

    res.json({
        message: "Successful login!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
});

// logs out user
// POST api/users/logout
const logout = asyncHandler(async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });
    res.json({message: "Sucessfully logged out user."});
});

module.exports = {register, login, logout};