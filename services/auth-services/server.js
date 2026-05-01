const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CALLBACK:", process.env.GOOGLE_CALLBACK_URL);

const authRoutes = require("./routes/authRoutes");
const passport = require("./config/passport");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Auth Service Running" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});