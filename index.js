const express = require("express");
const path = require("path");
const cors = require("cors");
const { Buffer } = require("buffer");
require("dotenv").config();

const connection = require("./connection/db");

const fs = require("fs");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("image");

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
  .use(express.urlencoded({ extended: true }))
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
  .post("/profile-image/:id", async (req, res) => {
    const userData = await User.findById(req.params.id);

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
      } else {
        const imageData = fs.readFileSync("uploads/" + req.file.filename);
        const imageBase64 = Buffer.from(imageData).toString("base64");
        const type = "image/png";

        await User.findByIdAndUpdate(userData.id, {
          $set: {
            profile_image: {
              data: imageBase64,
              contentType: type,
            },
            hasProfile: true,
          },
        });

        userData.save();

        return res.status(201).send({
          message: "successfully",
        });
      }
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
