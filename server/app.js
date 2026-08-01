const express = require("express");
const cors = require("cors");

const workerRoutes = require("./routes/workerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 VeriWork Backend Running");
});

app.use("/api/workers", workerRoutes);

module.exports = app;