const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connection = require("./connection/db");
const Post = require("./models/post");

// import routes
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const advertRoutes = require("./routes/advert");
const { User } = require("./models/user");

const app = express();
const PORT = process.env.PORT || 14961;

// db connection
connection();

app
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(cors())
  .use(express.static(path.join(__dirname, "public")))
  .use(express.static(path.join(__dirname, "models")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .set("routes", path.join(__dirname, "routes"))
  .use("/", homeRoutes)
  .use("/routes/posts", postRoutes)
  .use("/api/users", userRoutes)
  .use("/api", authRoutes)
  .use("/api/advert", advertRoutes)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//comment
//Added temporarily the comment to automatically deploy
