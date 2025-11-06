  require("dotenv").config();
  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");
  const statisticsRoutes = require("./routes/statisticsRoutes");

  const app = express();
  app.use(cors());
  app.use(express.json());

  // ====== Kết nối MongoDB ======
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

  // ====== Import Routes ======
  app.use("/users", require("./routes/userRoutes"));
  app.use("/parents", require("./routes/parentRoutes"));
  app.use("/drivers", require("./routes/driverRoutes"));
  app.use("/buses", require("./routes/busRoutes"));
  app.use("/students", require("./routes/studentRoutes"));
  app.use("/statistics", statisticsRoutes);


  // ====== Test Route ======
  app.get("/", (req, res) => res.send("🚍 SchoolBus API is running"));

  // ====== Chạy Server ======
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
