require("dotenv").config();
const express = require("express");
const db = require("./src/config/dbConfig");
const User = require("./src/models/userModel");
const Folder = require("./src/models/folderModel");
const File = require("./src/models/fileModel");
const userRoutes = require("./src/routes/userRoutes");
const folderRoutes = require("./src/routes/folderRoutes");
const fileRoutes = require("./src/routes/fileRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("errorHandle", err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Define associations between models (e.g., User to Folder and Folder to File)
User.hasMany(Folder);
Folder.belongsTo(User);

Folder.hasMany(File);
File.belongsTo(Folder);

// Synchronize the models with the database
db.sync({ force: false })
  .then(() => {
    console.log("Database connected and models synchronized.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
