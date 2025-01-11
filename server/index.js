require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.development",
});
// ~~~~~~~~~~~~~~ IMPORTS ~~~~~~~~~~~~~~~~
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
// ~~~~~~~~~~~~~~ MIDDLEWARE ~~~~~~~~~~~~~~~~
app.use(cors({origin: process.env.FRONTEND_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ~~~~~~~~~~~~~~ DATABASE CONNECTIVITY ~~~~~~~~~~~~~~~~
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  family: 4,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB", process.env.DATABASE_URL);
});


// ~~~~~~~~~~~~~~~ ROUTES ~~~~~~~~~~~~~~~~
app.get("/", (req, res) => {
  res.send("Backend is running");
});
const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);
const tasksRouter = require("./routes/tasks");
app.use("/api", tasksRouter);

// ~~~~~~~~~~~~~~~~ LISTEN ~~~~~~~~~~~~~~~~
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server listening the port " + port);
});
