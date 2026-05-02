const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors());

// Auth Service
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: (path) => `/api/auth${path}`,
  })
);

// Patient Service (Laravel nanti)
app.use(
  "/patients",
  createProxyMiddleware({
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
  })
);

app.listen(4000, () => {
  console.log("API Gateway running on port 4000");
}); 