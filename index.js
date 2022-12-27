const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connection = require("./connection/db");
const Post = require("./models/post");
const fs = require("fs");

const { ImageModel } = require("./models/testImage");
const { countAdvertLIst } = require("./models/count");

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
const { AdvertList } = require("./models/advert_list");
const { Tickets } = require("./models/tickets");
// const { isAuth } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 14961;

// db connection
connection();

// const random = Math.floor(Math.random() * 1000000000);
// console.log("random ", random);

const random =
  (parseInt(Math.floor(Math.random() * (999 - 0) + 0), 10) + 1000)
    .toString()
    .substr(1) +
  "-" +
  (parseInt(Math.floor(Math.random() * (999999999 - 0) + 0), 10) + 100000000)
    .toString()
    .substr(1) +
  "-" +
  (parseInt(Math.floor(Math.random() * (9999 - 0) + 0), 10) + 10000)
    .toString()
    .substr(1) +
  "-" +
  (parseInt(Math.floor(Math.random() * (99 - 0) + 0), 10) + 101)
    .toString()
    .substr(1);

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
        console.log("req.file mobile ", req.file);
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
  .get("/profile-image/:id", async (req, res) => {
    const profileImage = await User.findById(req.params.id);
    res.send(profileImage.profile_image);
  })
  .post("/profile-image/:id", async (req, res) => {
    const userData = await User.findById(req.params.id);

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("req.file ", req.file);
        // const newImage = new User({
        //   profile_image: {
        //     // data: fs.readFileSync("uploads/" + req.file.filename),
        //     data: fs.readFileSync("uploads/" + req.file.filename),
        //     contentType: "image/png",
        //   },
        // });

        await User.findByIdAndUpdate(userData.id, {
          $set: {
            profile_image: {
              // data: fs.readFileSync("uploads/" + req.file.filename),
              data: fs.readFileSync("uploads/" + req.file.filename),
              contentType: "image/png",
            },
          },
        });

        userData.save();

        res.status(201).send({
          message: " successfully",
          status: res.statusCode,
          userData,
        });

        // .then(() => res.send("Successful"))
        // .catch((err) => console.log(err));
      }
    });
  })
  // like
  // .put("/like/:id", isAuth, (req, res) => {
  .put("/like/:id", (req, res) => {
    AdvertList.findByIdAndUpdate(
      req.body.videoId,
      {
        $push: { likes: req.params.id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        console.log(err);
        return res.status(422).json({ error: err });
      } else {
        res.status(200).send(result);
      }
    });
  })
  // unlike
  .put("/unlike/:id", (req, res) => {
    AdvertList.findByIdAndUpdate(
      req.body.videoId,
      {
        $pull: { likes: req.params.id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
  })
  // watch
  .put("/watch/:id", (req, res) => {
    AdvertList.findByIdAndUpdate(
      req.body.videoId,
      {
        $push: { watch: req.params.id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        console.log("success ", result);
        return res.status(422).json({ error: err });
      } else {
        res.status(200).send(result);
      }
    });
  })
  //
  .put("/share/:id", (req, res) => {
    AdvertList.findByIdAndUpdate(
      req.body.videoId,
      {
        $push: { share: req.params.id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.status(200).send(result);
      }
    });
  })
  .post("/tickets/:id", async (req, res) => {
    User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          earnedTickets: {
            ...req.body,
          },
        },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.status(200).send({
          message: "success",
          result,
        });
      }
    });
    // try {
    //   const responseData = await new Tickets({
    //     ticketNumber: random,
    //     status: req.body.status,
    //   }).save();

    //   let data = responseData;

    //   res.status(201).send({
    //     message: "Ticket created successfully!",
    //     status: res.statusCode,
    //     createdAt: Date.now,
    //     data,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send({ message: "Internal Server Error" });
    // }
  })
  .get("/user/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const userData = await User.findById(id);
      res.json(userData);
      // console.log(advertLists);
    } catch (err) {
      res.json({ message: err });
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//comment
