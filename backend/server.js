const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static(path.join(__dirname, "../")));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.resolve(__dirname, "../", "index.html"));
  } else {
    res.status(404).json({ message: "API route not found" });
  }
});

const PORT = process.env.PORT || 5000;

const { errorHandler } = require("./middleware/errorMiddleware");

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
