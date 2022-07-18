const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const orders = require("./routes/orders");
// const stripe = require("./routes/stripe");
const users = require("./routes/users");
// const ordersDetailRoute = require("./routes/ordersDetail");

const ordersDetail = require("./ordersDetail");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/orders", orders);
// app.use("/api/stripe", stripe);
// app.use("/api/details", ordersDetailRoute);
app.use("/api/users", users);

app.get("/", (req, res) => {
    res.send("Welcome ");
});

app.get("/details", (req, res) => {
    res.send(ordersDetail);
});

const uri = process.env.DB_URI;
const port = process.env.PORT || 5051;

app.listen(port, () => {
    console.log(`Server running on port: ${port}...`);
});

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connection established..."))
    .catch((error) => console.error("MongoDB connection failed:", error.message));
