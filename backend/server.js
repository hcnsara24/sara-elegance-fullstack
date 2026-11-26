require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "https://hcnsara24.github.io"] }));
app.use(express.json());

// General rate limit on all /api routes
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({ message: "Sara Elegance API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
