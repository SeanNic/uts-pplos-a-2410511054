const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  register,
  login,
  refresh,
  logout,
  googleCallback,
} = require("../controllers/authController");

const verifyToken = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", verifyToken, logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
  }),
  googleCallback
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({
    message: "Google login failed",
  });
});

router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected route success",
    user: req.user,
  });
});

module.exports = router;