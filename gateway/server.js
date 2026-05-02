const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    message: "Terlalu banyak request, coba lagi nanti",
  },
});

app.use(limiter);

const publicRoutes = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/google",
  "/api/auth/google/callback",
  "/api/auth/google/failure",
];

const verifyGatewayToken = (req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Access token wajib dikirim melalui gateway",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Format token tidak valid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token tidak valid atau sudah expired",
    });
  }
};

app.use(verifyGatewayToken);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: (path) => `/api/auth${path}`,
  })
);

app.use(
  "/api/patient",
  createProxyMiddleware({
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    pathRewrite: (path) => `/api${path}`,
  })
);

app.use(
  "/api/medical",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
    pathRewrite: (path) => `/api${path}`,
  })
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 