require("dotenv").config();
const express = require("express");
const path = require("path");
const apiRouter = require("./server/routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", apiRouter);

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});
