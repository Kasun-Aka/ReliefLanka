require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

connectDB();

const app = express();

// CORS — allow local dev + Netlify production frontend.
// Set CORS_ORIGIN on Railway to your Netlify URL (e.g. https://relieflanka.netlify.app).
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CORS_ORIGIN, // set this on Railway
].filter(Boolean); // remove undefined if CORS_ORIGIN not set

app.use(
  cors({
    origin: (origin, callback) => {
      // allow REST clients (Postman, curl) and whitelisted browser origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => res.send("ReliefLanka API is running ✓"));

app.use("/api/requests", require("./routes/requests"));
app.use("/api/centers", require("./routes/centers"));
app.use("/api/volunteers", require("./routes/volunteers"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/users", require("./routes/users"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
