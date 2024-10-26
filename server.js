const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const loanRoutes = require("./routes/loanRoutes");
const plotRoutes = require("./routes/plotRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/loan", loanRoutes);
app.use("/api/plot", plotRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
