const express = require("express");
const path = require("path");
const cors = require("cors");
const { Buffer } = require("buffer");
require("dotenv").config();

const connection = require("./connection/db");

const fs = require("fs");

const { ImageModel } = require("./models/testImage");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    //cb(null, file.fieldname + "-" + Date.now());
    // cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");
// const upload = multer({ storage: storage });

// import routes
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const advertRoutes = require("./routes/advert");

const { User } = require("./models/user");
const { collection } = require("./models/post");

const app = express();
const PORT = process.env.PORT || 14961;

// db connection
connection();

// const random = Math.floor(Math.random() * 1000000000);
// console.log("random ", random);

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
  .get("/image", async (req, res) => {
    const allData = await ImageModel.find();
    res.json(allData);
  })
  .post("/upload", async (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        const newImage = new ImageModel({
          image: {
            // data: fs.readFileSync("uploads/" + req.file.filename),
            data: fs.readFileSync("uploads/" + req.file.filename),
            contentType: "image/png",
          },
        });
        newImage
          .save()
          .then(() => res.send("Successful"))
          .catch((err) => console.log(err));
      }
    });
  })
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

        res.status(201).send({
          message: "successfully",
          status: res.statusCode,
          userData,
        });
      }
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//comment
