require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("ReliefLanka API is running"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/centers", require("./routes/centers"));
app.use("/api/volunteers", require("./routes/volunteers"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/users", require("./routes/users"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
