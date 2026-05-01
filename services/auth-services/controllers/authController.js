const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const users = [];
const refreshTokens = [];
const blacklistedTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({
      message: "Name, email, and password are required",
    });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role: "patient",
  };

  users.push(user);

  return res.status(201).json({
    message: "User registered successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      message: "Email and password are required",
    });
  }

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.push(refreshToken);

  return res.status(200).json({
    message: "Login successful",
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

const refresh = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(401).json({
      message: "Refresh token required",
    });
  }

  if (!refreshTokens.includes(refresh_token)) {
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);

    const user = users.find((user) => user.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      access_token: newAccessToken,
      token_type: "Bearer",
      expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    });
  } catch (error) {
    return res.status(403).json({
      message: "Refresh token expired or invalid",
    });
  }
};

const logout = (req, res) => {
  const authHeader = req.headers["authorization"];
  const { refresh_token } = req.body;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  const token = authHeader.split(" ")[1];

  blacklistedTokens.push(token);

  if (refresh_token) {
    const index = refreshTokens.indexOf(refresh_token);

    if (index !== -1) {
      refreshTokens.splice(index, 1);
    }
  }

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

const googleCallback = (req, res) => {
  const googleUser = req.user;

  let user = users.find((user) => user.email === googleUser.email);

  if (!user) {
    user = {
      id: users.length + 1,
      name: googleUser.name,
      email: googleUser.email,
      password: null,
      role: "patient",
      oauth_provider: "google",
      photo: googleUser.photo,
    };

    users.push(user);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.push(refreshToken);

  return res.status(200).json({
    message: "Google login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      oauth_provider: user.oauth_provider,
      photo: user.photo,
    },
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
  });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  googleCallback,
  blacklistedTokens,
};