const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

connectDb();
const app = express();
// This is for deployment 
const port = process.env.PORT 

// Use for testing -> const port = process.env.PORT || 5555;
app.use(express.json());

// allow React frontend to access routes
// allow frontend to send httpOnly cookies
app.use(cors({ 
    origin: "http://localhost:3000",
    credentials: true
 }));

 app.use(cookieParser());

// Routes:
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});

// Export app for testing
module.exports = app;