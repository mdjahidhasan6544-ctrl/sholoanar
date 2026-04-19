const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const sliderRoutes = require("./routes/sliderRoutes");
const contentRoutes = require("./routes/contentRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(generalLimiter);
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" }, error: null });
});

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/content", contentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
