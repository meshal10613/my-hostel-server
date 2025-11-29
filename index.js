const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const { connectDB } = require("./config/db");
const config = require("./config/config");

const app = express();
const port = config.port || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// Connect to MongoDB
connectDB().then(() => console.log("MongoDB connected"));

// Routes
app.use("/users", require("./routes/userRoutes"));
app.use("/meals", require("./routes/mealRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/likes", require("./routes/likeRoutes"));
app.use("/ssl", require("./routes/sslRoutes"));
app.use("/stripe", require("./routes/stripeRoutes"));

// Root
app.get("/", (req, res) => res.send("Server is running successfully..."));

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () =>
    console.log(
        `Server running at http://localhost:${port} and https://my-hostel-server.onrender.com/`
    )
);

module.exports = app;
