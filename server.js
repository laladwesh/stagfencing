require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./server/db");
const apiRouter = require("./server/routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", apiRouter);

connectDB().catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client/build");
  app.use(express.static(clientBuildPath));

  app.get("/*splat", (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});
